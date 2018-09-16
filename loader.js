class Loader extends React.Component
{
  constructor (props)
  {
    super (props);

    this.canvas_id = `canvas_${Date.now ()}`;
  }

  sizeCanvas ()
  {
    const canvas = document.getElementById (this.canvas_id);
    const {width, height} = canvas.getBoundingClientRect();
    const scale = window.devicePixelRatio;
    [canvas.width, canvas.height] = [ scale * width, scale * height ];
    const ctx = canvas.getContext('2d');
    ctx.resetTransform();
    ctx.scale(scale, scale);

    return {width, height};
  }

  TURQUOISE = (a) => `rgba(64,224,208,${a})`;
  PURPLE = (a) => `rgba(200,128,208,${a})`;
  BLACK = (a) => `rgba(0,0,0,${a})`;
  GRAY = (a) => `rgba(128,128,128,${a})`;

  drawArc ({
    start = 0,
    end = 2 * Math.PI,
    drawPoints = false,
    clearRect = true,
    radius = this.RADIUS,
    strokeStyle = 'black'
  } = {})
  {
    const canvas = document.getElementById (this.canvas_id);
    const ctx = canvas.getContext('2d');
    const [center_x, center_y] = [ this.WIDTH / 2, this.HEIGHT / 2 ];
    if (clearRect)
    {
      ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
    }
    ctx.strokeStyle = strokeStyle;
    ctx.beginPath();
    ctx.arc(center_x, center_y, radius, start, end);
    ctx.stroke();

    if (drawPoints)
    {
      const [start_x, start_y] = [
        radius * Math.cos(start) + center_x,
        radius * Math.sin(start) + center_y,
      ];
      ctx.beginPath();
      ctx.arc(start_x, start_y, 2, 0, 2 * Math.PI)
      ctx.fillStyle = 'green';
      ctx.fill();
      ctx.stroke();

      const [end_x, end_y] = [
        radius * Math.cos(end) + center_x,
        radius * Math.sin(end) + center_y,
      ];
      ctx.beginPath();
      ctx.arc(end_x, end_y, 2, 0, 2 * Math.PI)
      ctx.fillStyle = 'red';
      ctx.fill();
      ctx.stroke();
    }
  }

  startAnimation ({
    period = 60,                // frames
    lag = .33,                  // fraction of period
    offset = 0,                 // radians
    N = 10,                     // number of rings
    refocusEvery = N / 2,       // frames per refocus
    highlightColor = this.TURQUOISE, // signature: (opacity) => `rgba(?,?,?,${opacity})`
    opacityStep = 1.61803399,   // opacity-factor each ring steps down by
  } = {})
  {
    const radians = 2 * Math.PI;
    const hann = (x) => Math.sin(Math.PI * (x + .25 - .8 / 2 / Math.PI)) ** 2 / Math.PI * .8;

    let end = 0;
    let focus = 0; // index of highlighted ring
    let ID;

    const animate = () => {
      end++;
      const progress = (end % period) / period;
      const end_angle = progress * radians + offset;
      const start_angle = end_angle - (hann (progress) + lag) * radians;

      // outermost static solid ring
      this.drawArc ({
        strokeStyle : this.BLACK (.5),
        radius : this.RADIUS * 1 / .95,
      });

      // inner swirling rings
      const dx = end_angle - start_angle;
      for (let i = 0; i < N; i++)
      {
        // const opacity = 1;
        // const opacity = Math.min (1/1.61803399**i*2, 1);
        const opacity = 1 / opacityStep ** i;
        this.drawArc ({
          start : start_angle + dx * (i / N) + i / N * 3,
          end : end_angle + dx * (i / N) + i / N * 3,
          clearRect : false,
          radius : this.RADIUS * (1 - i / N),
          strokeStyle : (N - Math.abs(focus - N) >= i)
                            ? highlightColor (opacity)
                            : this.GRAY (opacity),
        });
      }

      // refocus
      if (end % ~~(refocusEvery) == 0)
      {
        // console.log (N - Math.abs (focus - N))
        focus = (focus + 1) % (2 * N);
      }
    };

    ID = window.setInterval(animate, 17);
    return ID;
  }

  componentDidMount ()
  {
    const {width, height} = this.sizeCanvas ();
    [this.WIDTH, this.HEIGHT] = [width, height];
    this.RADIUS = Math.min(this.WIDTH / 2, this.HEIGHT / 2) * .9;
    this.interval = this.startAnimation (this.props.animation);
  }

  componentWillUnmount ()
  {
    window.clearInterval (this.interval);
  }

  render ()
  {
    console.log ('render Loader', this.canvas_id, this.props.style)
    return (
      <canvas
        id={ this.canvas_id }
        className='Loader'
        style={ this.props.style }
      >
      </canvas>
    );
  }
}
