module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        //第一种情况
        "eslint:recommended",
        //第二种情况：一般配置的时候可以省略`eslint-config`
        // "standard"

        //第三种情况：可以省略包名中的`eslint-plugin`
        // 格式一般为: `plugin:${pluginName}/${configName}`
        "plugin:vue/essential",
        "plugin:@typescript-eslint/recommended",
    ],
    parserOptions: {
        ecmaVersion: "latest",
        parser: "@typescript-eslint/parser",
        sourceType: "module",
    },
    plugins: ["vue", "@typescript-eslint"],
    rules: {
        indent: ["error", "2"], //强制使用一致的缩进
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "double"], //强制使用一致的反勾号、双引号或单引号 (quotes)
        semi: ["error", "always"], //要求或禁止使用分号
        "@typescript-eslint/ban-ts-comment": "error",
        "@typescript-eslint/no-explicit-any": "warn",
    },
};