const sdk = require('cue-sdk');
const config = JSON.parse(localStorage.getItem('config'));
const { cue } = require("./cue");

const amibilight = {
  init: function (positions, devices) {
    this.c1 = document.getElementById("c1");
    this.ctx1 = this.c1.getContext("2d");

    // Override the disabled color if it is not present in the config
    if (!config.disabledColor || config.disabledColor.r) {
      config.disabledColor = {
        r: 0,
        g: 0,
        b: 0
      }

      localStorage.setItem("config", JSON.stringify(config))
    }

    this.positions = positions;
    this.devices = devices;

    console.log(this.devices);

    let self = this;
    setInterval(function () {
      self.updateLeds();
    }, 1000 / config?.refreshrate ? config.refreshrate : 30);
  },

  updateLeds: function () {
    for (let i = 0; i < this.positions.length; i++) {
      if (this.positions[i].length > 0) {
        sdk.CorsairSetLedsColorsBufferByDeviceIndex(i, this.getColors(i, this.positions[i]));
        sdk.CorsairSetLedsColorsFlushBuffer();
      }
    }
  },

  getColors: function (index, positions) {
    const device = this.devices[index];

    if (!device.enabled) {
      return colors = positions.map((p) => {
        return {
          ledId: p.ledId,
          r: config.disabledColor.r,
          g: config.disabledColor.g,
          b: config.disabledColor.b
        };
      }); 
    }

    const xScale = (device.x2 / device.sizeX);
    const yScale = (device.y2 / device.sizeY);
     
    return colors = positions.map((p) => {
      const imgData = this.ctx1.getImageData(device.x1 + (p.left * xScale), device.y1 + (p.top * yScale), device.x1 + (p.width * xScale), device.y1 + (p.width * yScale)).data;
      
      return {
        ledId: p.ledId,
        r: imgData[0],
        g: imgData[1],
        b: imgData[2]
      };
    }); 
  },
};

exports.amibilight = amibilight;  
