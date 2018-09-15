const time = () => {
  const d = new Date ();
  const h = d.getHours ();
  const m = d.getMinutes ();
  const s = d.getSeconds ();
  const half = h >=12 ? 'pm' : 'am';
  const h_std = h%12 + 12*!(h%12);
  const digits = (x) => x < 10 ? `0${x}` : `${x}`;
  return `${h_std}:${digits (m)}:${digits (s)} ${half}`;
};
const LOG = (...args) => console.log (time (), '|', ...args);

class Friend extends React.Component
{
  state = {
    hoverActive: false,
    hoverRemove: false,
  };
  hoverActive = (value) =>
  {
    this.setState ({ hoverActive: value });
  };
  hoverRemove = (value) =>
  {
    this.setState ({ hoverRemove: value });
  };
  render ()
  {
    const color = ['gray', 'blue'];
    const active = Number (this.props.active);
    const removeIndex = Number (this.state.hoverRemove);
    const activeIndex = this.state.hoverActive ? 1 - active : active;
    const removeIcon = ['❌', '💀'][removeIndex];
    const activeIcon = ['💩', '🔥'][activeIndex];
    const style = {
      border: '1px solid gray',
      borderRadius: '50%',
      width: '1.5rem',
      height: '1.5rem',
      fontSize: '1rem',
      lineHeight: '1.5rem',
      display: 'inline-block',
      textAlign: 'center',
      marginLeft: '5px',
    };

    return (
      <div style={ {color: color[active], paddingBottom: '5px'} }>
        { this.props.id }
        <span style={ style }
          onClick={ () => this.props.toggle (this.props.id) }
          onMouseEnter={ () => this.hoverActive (true) }
          onMouseLeave={ () => this.hoverActive (false) }>
          { activeIcon }
        </span>
        <span style={ style }
          onClick={ () => this.props.remove (this.props.id) }
          onMouseEnter={ () => this.hoverRemove (true) }
          onMouseLeave={ () => this.hoverRemove (false) }>
          { removeIcon }
        </span>
      </div>
    );
  }
}

class List extends React.Component
{
  componentDidMount ()
  {
    document.getElementById('app').classList.remove ('invisible');
    document.querySelector ('a').classList.remove ('invisible');
  }
  remove = (id) =>
  {
    LOG ('remove > ', id)
    this.setState ( (state) => ({
      items: state.items.filter (f => f.id !== id)
    }));
  };
  state = {
    items: [
      {
        id: 'Michiru',
        active: true,
      },
      {
        id: 'Yuuji',
        active: true,
      },
      {
        id: 'Makina',
        active: true,
      },
      {
        id: 'Amane',
        active: true,
      },
      {
        id: 'Yumiko',
        active: true,
      },
      {
        id: 'Sachi',
        active: true,
      },
      {
        id: 'Kazuki',
        active: true,
      },
    ],
  };
  add = (id) =>
  {
    if (this.state.items.findIndex (f => f.id === id) > -1)
    {
      return `${id} already exists!`;
    }
    if (!id.length)
    {
      return `No name given!`;
    }
    const item = { id: id, active: true }
    this.setState( (state) => ({
      items: [...state.items, item]
    }));
    return false;
  };
  toggle = (id) =>
  {
    this.setState ( (state) =>
      ({
        items: state.items.map (item =>
          item.id === id ? {...item, active: !item.active} : item
        )
      })
    );
  };

  render ()
  {
    const active = this.state.items.filter (f => f.active);
    const inactive = this.state.items.filter (f => !f.active);
    const elemType = this.props.elemType;
    const elemProps = { remove: this.remove, toggle: this.toggle };

    return (
      <div>
        <h1>Friends List</h1>
        <AddItem add={ this.add } />
        <h2>Active</h2>
        <ListView items={ active } elemType={ elemType } elemProps={ elemProps } />
        <h2>Inactive</h2>
        <ListView items={ inactive } elemType={ elemType } elemProps={ elemProps } />
      </div>
    );
  }
}

function ListView ({items, elemType, elemProps})
{
  LOG ('rendering ListView')
  return (
    <div>
    {
      items.map (item =>
        React.createElement (elemType, {...item, ...elemProps, key: item.id})
      )
    }
    </div>
  );
}

class AddItem extends React.Component
{
  state = {
    value: '',
    error: false,
  }
  update = (e) =>
  {
    this.setState ({
      value: e.target.value
    });
  }
  reset = () =>
  {
    LOG ('reset')
    this.setState ({
      value: '',
      error: false,
    });
  }
  submit = (e) =>
  {
    e.preventDefault ();
    LOG ('submit')
    if (this.state.error)
    {
      LOG ('submit > pass')
      return;
    }

    const errorMsg = this.props.add (this.state.value);
    if (errorMsg)
    {
      LOG ('submit > error')
      this.setState ({
        value: errorMsg,
        error: true,
      });
      setTimeout (this.reset, 600);
    }
    else
    {
      LOG ('submit > ok')
      this.reset ();
    }
  }
  render ()
  {
    return (
      <form onSubmit={ this.submit }>
        <input
          type='text'
          value={ this.state.value }
          placeholder={ `Your friend's name` }
          onChange={ this.update }
        />
        <button>Add Friend</button>
      </form>
    );
  }
}

ReactDOM.render (
  <List elemType={ Friend } />,
  document.getElementById('app')
);
