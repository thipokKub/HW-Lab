const path = require('path')
const glob = require('glob')

module.exports = {
    webpack: (config, {dev}) => {
        config.module.rules.push(
            {
                test: /\.(css|scss)/,
                loader: 'emit-file-loader',
                options: {
                    name: 'dist/[path][name].[ext]'
                }
            }
            ,
            {
                test: /\.css$/,
                loader: 'babel-loader!raw-loader'
            }
            ,
            {
                test: /\.scss$/,
                loader: 'babel-loader!raw-loader!sass-loader'
            },
            {
                test: /\.scss$/,
                loader: 'sass-loader',
                options: {
                    includePaths: ['common/scss']
                        .map((d) => path.join(__dirname, d))
                        .map((g) => glob.sync(g))
                        .reduce((a, c) => a.concat(c), [])
                }
            }
        )
        return config
    }
}