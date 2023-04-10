module.exports = {
    port: 8080,
    files: ['.src/**/*.{html,htm,css,js}'],
    server: {
        baseDir: ["./src", "./Frontend", "./build/contracts"]
    }
};