const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader'); 

module.exports = {
    entry: {
        main: './html/script/main.js',
        addmanga: './html/script/addmanga.js',
        contact: './html/script/contact.js',
        Manga: './html/script/Manga.js',
        profil: './html/script/profil.js',
        signIn: './html/script/signIn.js',
    },
    output: {
        filename: './js/[name].bundle.js',
        path: path.resolve(__dirname, '../src/public'),
        clean: true
    },
    resolve: {
        extensions: ['.vue', '.ts', '.js'],
    },
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: './html/index.html',
            filename: './html/index.html',
            chunks: ['main']
        }),
        new HtmlWebpackPlugin({
            template: './html/addmanga.html',
            filename: './html/addmanga.html',
            chunks: ['addmanga']
        }),
        new HtmlWebpackPlugin({
            template: './html/contact.html',
            filename: './html/contact.html',
            chunks: ['contact']
        }),
        new HtmlWebpackPlugin({
            template: './html/manga.html',
            filename: './html/manga.html',
            chunks: ['Manga']
        }),
        new HtmlWebpackPlugin({
            template: './html/profil.html',
            filename: './html/profil.html',
            chunks: ['profil']
        }),
        new HtmlWebpackPlugin({
            template: './html/signIn.html',
            filename: './html/signIn.html',
            chunks: ['signIn']
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'html/css'),
                    to: './css',
                    noErrorOnMissing: true
                },
                {
                    from: path.resolve(__dirname, 'src/img'),
                    to: './img',
                    noErrorOnMissing: true
                },
            ],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(ts|tsx)$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        appendTsSuffixTo: [/\.vue$/],
                    },
                },
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            }
        ]
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
};
