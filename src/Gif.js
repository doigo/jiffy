import React, {Component} from 'react';

class Gif extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }
  render() {
    console.log(this.props);
    const {images} = this.props;
    const {loaded} = this.state;
    const {id} = this.props;
    return (
      <video
        className={`grid-item video ${loaded && 'loaded'}`}
        autoPlay
        loop
        src={images.original.mp4}
        onLoadedData={() => this.setState({loaded: true})}
      />
    );
  }
}

export default Gif;
