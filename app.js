// import Loader from 'loader.js';

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

    return (
      <div style={ {color: color[active], paddingBottom: '5px'} }>
        { this.props.id }
        <span className='icon'
          onClick={ () => this.props.toggle (this.props.id) }
          onMouseEnter={ () => this.hoverActive (true) }
          onMouseLeave={ () => this.hoverActive (false) }>
          { activeIcon }
        </span>
        <span className='icon'
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
    document.querySelectorAll ('.invisible').forEach (elem =>
      elem.classList.remove ('invisible')
    );

    API.fetch ()
      .then ( items =>
        this.setState ({ items, loading: false })
      );
  }
  remove = (id) =>
  {
    LOG ('remove > ', id)
    this.setState ( (state) => ({
      items: state.items.filter (f => f.id !== id)
    }));
  };
  state = {
    items: [],
    loading: true,
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
  clearAll = () =>
  {
    this.setState ({items: []});
  }

  render ()
  {
    const active = this.state.items.filter (f => f.active);
    const inactive = this.state.items.filter (f => !f.active);
    const elemType = this.props.elemType;
    const elemProps = { remove: this.remove, toggle: this.toggle };

    const loaderStyles = { margin: '10px auto' };

    return (
      <div className='List'>
        <h1>Friends List</h1>
        <AddItem add={ this.add } />
        <h2>Active</h2>
        {
          this.state.loading
            ? <Loader style={ loaderStyles }/>
            : <ListView items={ active } elemType={ elemType } elemProps={ elemProps } />
        }
        <h2>Inactive</h2>
        {
          this.state.loading
            ? <Loader style={ loaderStyles } animation={ {offset: Math.PI * 2 * .33} }/>
            : <ListView items={ inactive } elemType={ elemType } elemProps={ elemProps } />
        }
        <button onClick={ this.clearAll } disabled={ !this.state.items.length }>Clear All</button>
      </div>
    );
  }
}

function ListView ({items, elemType, elemProps})
{
  LOG ('rendering ListView')
  return (
    <div className='ListView'>
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
