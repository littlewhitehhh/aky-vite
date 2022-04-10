module.exports = {
    env: {
        browser: true,
        es2021: true
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

        //1 接入prettier规则
        "prettier",
        "plugin:prettier/recommended"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        parser: "@typescript-eslint/parser",
        sourceType: "module"
    },
    //2. 加入 prettier 的 eslint 插件
    plugins: ["vue", "@typescript-eslint", "prettier"],
    rules: {
        // 3. 注意要加上这一句，开启 prettier 自动修复的功能
        "prettier/prettier": "error",
        indent: ["error", "2"], //强制使用一致的缩进
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "double"], //强制使用一致的反勾号、双引号或单引号 (quotes)
        semi: ["error", "always"], //要求或禁止使用分号
        "@typescript-eslint/ban-ts-comment": "error",
        "@typescript-eslint/no-explicit-any": "warn"
    }
};