
## About

A simple app to practice spelling tests for my kids. It uses the Mac OS X `say` command line tool to generate the audio from a list of words. 

## Install

- Clone: `git clone git@github.com:mvhenderson/spell.git && cd spell`
- Install: `npm install`
- Run (LiveReload): `grunt serve`
- Build (into ./dist): `grunt build`

To rebuild the audio files run `grunt audio`. This takes an optional parameter to specify the void to use, for example: `grunt audio:Vicki`. 

## Contribute

Review the [issue list](https://github.com/mvhenderson/spell/issues) and fix bugs.

Areas that definitely need improvement are audio quality/file-size and smart-phone/tablet optimization.

## License

[MIT License](http://opensource.org/licenses/MIT)
