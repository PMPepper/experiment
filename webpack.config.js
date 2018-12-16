const path = require('path');

const config = {
  entry: './src/js/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'scripts.js'
  }
};

module.exports = (env, argv) => {
  const mode = argv.mode || 'development';
  config.mode = mode;
  
  if (mode === 'development') {
    config.devtool = 'source-map';
  } else if(mode === 'production') {
	
  } else {
	throw new Error('Invalid mode: '+argv.mode);
  }

  return config;
};