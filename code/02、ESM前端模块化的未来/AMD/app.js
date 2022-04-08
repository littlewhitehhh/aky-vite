require.config({
    baseUrl: "lib",
    paths: {
        app: "../app",
    },
});

requirejs(["app/main.js"]);