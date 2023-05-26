## Documentation

Please visit [three-globe](https://github.com/vasturiano/three-globe) for detailed documentation if you want to edit the `Globe` object to add data visualization. Speaking of the Glow, `three-globe` does not let you access the glow mesh object yet, so the default glow was turned off and a separate `three-glow-mesh` is added to the scene instead.

## Usage

This project is bundled with [Webpack](https://webpack.js.org/):

```json
"build": "webpack --config=webpack.prod.js",
"build-dev": "webpack --config=webpack.dev.js",
"start": "webpack serve webpack-dev-server --open --config=webpack.dev.js"
```

Details:

```bash
npm start        # development build in ./dist
npm run build    # static production build in ./
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
