/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const { checkPublish, messages } = require("../util/check-publish")
const getAllowModules = require("../util/get-allow-modules")
const getConvertPath = require("../util/get-convert-path")
const getResolvePaths = require("../util/get-resolve-paths")
const getTryExtensions = require("../util/get-try-extensions")
const visitRequire = require("../util/visit-require")

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        docs: {
            description:
                "disallow `require()` expressions which import private modules",
            recommended: true,
            url: "https://github.com/eslint-community/eslint-plugin-n/blob/HEAD/docs/rules/no-unpublished-require.md",
        },
        type: "problem",
        fixable: null,
        schema: [
            {
                type: "object",
                properties: {
                    allowModules: getAllowModules.schema,
                    convertPath: getConvertPath.schema,
                    resolvePaths: getResolvePaths.schema,
                    tryExtensions: getTryExtensions.schema,
                },
                additionalProperties: false,
            },
        ],
        messages,
    },
    create(context) {
        const filePath = context.filename ?? context.getFilename()
        if (filePath === "<input>") {
            return {}
        }

        return visitRequire(context, {}, targets => {
            checkPublish(context, filePath, targets)
        })
    },
}
