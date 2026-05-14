# Climber

## Running the game

The game uses ES modules, which browsers refuse to load over the `file://` protocol (you'll see a CORS error). You need to serve the files over HTTP.

From this directory, run one of:

```
python3 -m http.server 8000
```

or

```
npx serve .
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.
