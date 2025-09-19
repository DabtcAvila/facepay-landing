const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
const ImageMinimizerPlugin = require('imagemin-webpack-plugin').default;
const CriticalCSSPlugin = require('critical-css-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

module.exports = {
    mode: isProduction ? 'production' : 'development',
    
    // Entry points with code splitting
    entry: {
        main: './src/main.js',
        performance: './performance.js',
        'service-worker': './service-worker-v2.js'
    },
    
    // Output configuration
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: isProduction 
            ? 'js/[name].[contenthash:8].js'
            : 'js/[name].js',
        chunkFilename: isProduction
            ? 'js/[name].[contenthash:8].chunk.js'
            : 'js/[name].chunk.js',
        publicPath: '/',
        clean: true,
        // Enable efficient chunk loading
        chunkLoadingGlobal: 'webpackChunkFacePay',
        // Optimize for HTTP/2
        pathinfo: false
    },
    
    // Development server configuration
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 3000,
        hot: true,
        historyApiFallback: true,
        // Enable HTTP/2 in development
        http2: true,
        // Enable gzip compression
        compress: true
    },
    
    // Optimization configuration - Aggressive tree shaking and compression
    optimization: {
        minimize: isProduction,
        minimizer: [
            // JavaScript optimization
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: isProduction,
                        drop_debugger: isProduction,
                        pure_funcs: ['console.log', 'console.info'],
                        passes: 3,
                        unsafe_arrows: true,
                        unsafe_methods: true,
                        unsafe_proto: true,
                        unsafe_regexp: true
                    },
                    mangle: {
                        safari10: true,
                        properties: {
                            regex: /^_/
                        }
                    },
                    format: {
                        comments: false
                    }
                },
                parallel: true,
                extractComments: false
            }),
            
            // CSS optimization
            new CssMinimizerPlugin({
                minimizerOptions: {
                    preset: ['default', {
                        discardComments: { removeAll: true },
                        normalizeWhitespace: true,
                        colormin: true,
                        convertValues: true,
                        discardDuplicates: true,
                        discardEmpty: true,
                        mergeIdents: true,
                        mergeLonghand: true,
                        mergeRules: true,
                        minifyFontValues: true,
                        minifyGradients: true,
                        minifyParams: true,
                        minifySelectors: true,
                        normalizeCharset: true,
                        normalizeDisplayValues: true,
                        normalizePositions: true,
                        normalizeRepeatStyle: true,
                        normalizeString: true,
                        normalizeTimingFunctions: true,
                        normalizeUnicode: true,
                        normalizeUrl: true,
                        orderedValues: true,
                        reduceIdents: true,
                        reduceInitial: true,
                        reduceTransforms: true,
                        svgo: true,
                        uniqueSelectors: true
                    }]
                }
            })
        ],
        
        // Code splitting configuration
        splitChunks: {
            chunks: 'all',
            minSize: 20000,
            maxSize: 100000,
            cacheGroups: {
                // Vendor chunks for third-party libraries
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                    priority: 20,
                    reuseExistingChunk: true
                },
                
                // Common chunks for shared code
                common: {
                    minChunks: 2,
                    chunks: 'all',
                    name: 'common',
                    priority: 10,
                    reuseExistingChunk: true
                },
                
                // CSS chunks
                styles: {
                    name: 'styles',
                    test: /\.(css|scss|sass)$/,
                    chunks: 'all',
                    enforce: true,
                    priority: 30
                },
                
                // Performance critical chunk
                critical: {
                    test: /critical\.(js|css)$/,
                    name: 'critical',
                    chunks: 'all',
                    priority: 40,
                    enforce: true
                }
            }
        },
        
        // Runtime optimization
        runtimeChunk: {
            name: 'runtime'
        },
        
        // Enable module concatenation for better tree shaking
        concatenateModules: true,
        
        // Remove empty chunks
        removeEmptyChunks: true,
        
        // Optimize module IDs
        moduleIds: isProduction ? 'deterministic' : 'named',
        chunkIds: isProduction ? 'deterministic' : 'named'
    },
    
    // Module rules for different file types
    module: {
        rules: [
            // JavaScript/TypeScript processing
            {
                test: /\.(js|ts)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', {
                                    useBuiltIns: 'usage',
                                    corejs: 3,
                                    modules: false,
                                    targets: {
                                        browsers: ['> 0.25%', 'not dead']
                                    }
                                }]
                            ],
                            plugins: [
                                '@babel/plugin-syntax-dynamic-import',
                                '@babel/plugin-proposal-optional-chaining',
                                '@babel/plugin-proposal-nullish-coalescing-operator'
                            ],
                            cacheDirectory: true,
                            cacheCompression: false
                        }
                    }
                ]
            },
            
            // CSS processing with optimization
            {
                test: /\.css$/,
                use: [
                    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            sourceMap: isDevelopment
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    'autoprefixer',
                                    'postcss-preset-env',
                                    ...(isProduction ? [
                                        'cssnano',
                                        'postcss-combine-duplicated-selectors',
                                        'postcss-merge-rules'
                                    ] : [])
                                ]
                            }
                        }
                    }
                ]
            },
            
            // Image processing with modern format support
            {
                test: /\.(png|jpe?g|gif|svg|webp|avif)$/i,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 8 * 1024 // 8kb
                    }
                },
                generator: {
                    filename: 'images/[name].[contenthash:8][ext]'
                }
            },
            
            // Font processing with subsetting
            {
                test: /\.(woff|woff2|ttf|eot)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name].[contenthash:8][ext]'
                }
            },
            
            // Video processing
            {
                test: /\.(mp4|webm|ogg|mov)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'videos/[name].[contenthash:8][ext]'
                }
            }
        ]
    },
    
    // Plugins for enhanced optimization
    plugins: [
        // HTML processing with optimization
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html',
            minify: isProduction ? {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            } : false,
            inject: true,
            // Inline critical CSS
            inlineSource: isProduction ? 'critical\\.css$' : false
        }),
        
        // CSS extraction and optimization
        ...(isProduction ? [
            new MiniCssExtractPlugin({
                filename: 'css/[name].[contenthash:8].css',
                chunkFilename: 'css/[name].[contenthash:8].chunk.css',
                ignoreOrder: false
            })
        ] : []),
        
        // Critical CSS extraction
        ...(isProduction ? [
            new CriticalCSSPlugin({
                base: path.resolve(__dirname, 'dist'),
                src: 'index.html',
                dest: 'index.html',
                inline: true,
                minify: true,
                extract: true,
                width: 1300,
                height: 900,
                penthouse: {
                    blockJSRequests: false
                }
            })
        ] : []),
        
        // Service Worker generation
        new WorkboxPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true,
            maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
            runtimeCaching: [
                {
                    urlPattern: /^https:\/\/fonts\.googleapis\.com/,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'google-fonts-stylesheets',
                        expiration: {
                            maxEntries: 5,
                            maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                        }
                    }
                },
                {
                    urlPattern: /^https:\/\/fonts\.gstatic\.com/,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'google-fonts-webfonts',
                        expiration: {
                            maxEntries: 20,
                            maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                        }
                    }
                },
                {
                    urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'images',
                        expiration: {
                            maxEntries: 50,
                            maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
                        }
                    }
                },
                {
                    urlPattern: /\.(?:mp4|webm|ogg)$/,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'videos',
                        expiration: {
                            maxEntries: 5,
                            maxAgeSeconds: 60 * 60 * 24 * 3 // 3 days
                        }
                    }
                }
            ]
        }),
        
        // Compression plugins
        ...(isProduction ? [
            new CompressionPlugin({
                algorithm: 'gzip',
                test: /\.(js|css|html|svg)$/,
                threshold: 8192,
                minRatio: 0.8
            }),
            
            new CompressionPlugin({
                algorithm: 'brotliCompress',
                test: /\.(js|css|html|svg)$/,
                compressionOptions: {
                    level: 11
                },
                threshold: 8192,
                minRatio: 0.8,
                filename: '[path][base].br'
            })
        ] : []),
        
        // Image optimization
        ...(isProduction ? [
            new ImageMinimizerPlugin({
                test: /\.(jpe?g|png|gif|svg)$/i,
                minimizerOptions: {
                    plugins: [
                        ['imagemin-mozjpeg', { quality: 80 }],
                        ['imagemin-pngquant', { quality: [0.65, 0.8] }],
                        ['imagemin-gifsicle', { interlaced: true }],
                        ['imagemin-svgo', {
                            plugins: [
                                { name: 'preset-default' },
                                { name: 'removeViewBox', active: false }
                            ]
                        }]
                    ]
                }
            })
        ] : []),
        
        // Bundle analyzer (only in production with analyze flag)
        ...(isProduction && process.env.ANALYZE ? [
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                openAnalyzer: false,
                generateStatsFile: true
            })
        ] : [])
    ],
    
    // Resolve configuration
    resolve: {
        extensions: ['.js', '.ts', '.json'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@components': path.resolve(__dirname, 'src/components'),
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@styles': path.resolve(__dirname, 'src/styles')
        },
        // Module resolution optimization
        modules: ['node_modules'],
        symlinks: false
    },
    
    // Performance hints and budgets
    performance: {
        maxAssetSize: 100000, // 100kb
        maxEntrypointSize: 100000, // 100kb
        hints: isProduction ? 'error' : false
    },
    
    // Source maps
    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
    
    // Stats configuration
    stats: {
        preset: 'minimal',
        moduleTrace: true,
        errorDetails: true
    },
    
    // Cache configuration for faster builds
    cache: {
        type: 'filesystem',
        buildDependencies: {
            config: [__filename]
        }
    },
    
    // Experiments for cutting-edge features
    experiments: {
        topLevelAwait: true,
        outputModule: false
    },
    
    // Target modern browsers for smaller bundles
    target: ['web', 'es2017'],
    
    // External dependencies (for CDN usage)
    externals: isProduction ? {
        // Example: Use CDN versions in production
        // 'lodash': '_'
    } : {}
};