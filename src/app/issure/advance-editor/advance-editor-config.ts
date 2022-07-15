var editTextfieldCompDisplay = [
    {
        "key": "tooltip",
        "ignore": true
    },
    {
        "key": "prefix",
        "ignore": true
    },
    {
        "key": "labelPosition",
        "ignore": true
    },
    {
        "key": "labelWidth",
        "ignore": true
    },
    {
        "key": "labelMargin",
        "ignore": true
    },
    {
        "key": "row",
        "ignore": true
    },
    {
        "key": "suffix",
        "ignore": true
    },
    {
        "key": "widget.type",
        "ignore": true
    },
    {
        "key": "inputMaskPlaceholderChar",
        "ignore": true
    },
    {
        "key": "displayMask",
        "ignore": true
    },
    {
        "key": "autocomplete",
        "ignore": true
    },
    {
        "key": "uploadUrl",
        "ignore": true
    },
    {
        "key": "fileKey",
        "ignore": true
    },
    {
        "key": "inputMask",
        "ignore": true
    },
    {
        "key": "tabindex",
        "ignore": true
    },
    {
        "key": "customClass",
        "ignore": true
    },
    {
        "key": "allowMultipleMasks",
        "ignore": true
    },
    {
        "key": "hidden",
        "ignore": true
    },
    {
        "key": "hideLabel",
        "ignore": true
    },
    {
        "key": "showWordCount",
        "ignore": true
    },
    {
        "key": "showCharCount",
        "ignore": true
    },
    {
        "key": "mask",
        "ignore": true
    },
    {
        "key": "autofocus",
        "ignore": true
    },
    {
        "key": "spellcheck",
        "ignore": true
    },
    {
        "key": "disabled",
        "ignore": true
    },
    {
        "key": "tableView",
        "ignore": true
    },
    {
        "key": "modalEdit",
        "ignore": true
    },
    {
        "key": "rows",
        "ignore": true
    },
    {
        "key": "editor",
        "ignore": true
    },
    {
        "key": "autoExpand",
        "ignore": true
    },
    {
        "key": "shortcut",
        "ignore": true
    },
    {
        "key": "inputType",
        "ignore": true
    },
    {
        "key": "inline",
        "ignore": true
    },
    {
        "key": "optionsLabelPosition",
        "ignore": true
    },
    {
        "key": "widget",
        "ignore": true
    },
    {
        "key": "uniqueOptions",
        "ignore": true
    }
];

var editTextfieldCompValidation = [
    {
        "key": "validateOn",
        "ignore": true
    },
    {
        "key": "unique",
        "ignore": true
    },
    {
        "key": "validate.minLength",
        "ignore": true
    },
    {
        "key": "validate.maxLength",
        "ignore": true
    },
    {
        "key": "validate.minWords",
        "ignore": true
    },
    {
        "key": "validate.maxWords",
        "ignore": true
    },
    {
        "key": "validate.pattern",
        "ignore": true
    },
    {
        "key": "errorLabel",
        "ignore": true
    },
    {
        "key": "validate.customMessage",
        "ignore": true
    },
    {
        "key": "custom-validation-js",
        "ignore": true
    },
    {
        "key": "json-validation-json",
        "ignore": true
    },
    {
        "key": "errors",
        "ignore": true
    },
    {
        "key": "validate.min",
        "ignore": true
    },
    {
        "key": "validate.max",
        "ignore": true
    },
    {
        "key": "validate.onlyAvailableItems",
        "ignore": true
    },
    {
        "key": "validate.minSelectedCount",
        "ignore": true
    },
    {
        "key": "validate.maxSelectedCount",
        "ignore": true
    },
    {
        "key": "maxSelectedCountMessage",
        "ignore": true
    },
    {
        "key": "minSelectedCountMessage",
        "ignore": true
    },
];

var editTextfieldApiTabs = { key: 'api', ignore: true };
var editTextfieldDataTabs = { key: 'data', ignore: true };
var editTextfieldConditionalTabs = { key: 'conditional', ignore: true };
var editTextfieldLogicTabs = { key: 'logic', ignore: true };
var editTextfieldLayoutTabs = { key: 'layout', ignore: true };

var hideShowFormComponentConfig = [
    {
        "key": "display",
        "ignore": false,
        "components": editTextfieldCompDisplay
    },
    {
        "key": "validation",
        "ignore": false,
        "components": editTextfieldCompValidation
    },
    editTextfieldApiTabs,
    editTextfieldDataTabs,
    editTextfieldConditionalTabs,
    editTextfieldLogicTabs,
    editTextfieldLayoutTabs

]

export const editorConfig = {
    disabled: [],
    builder: {
        basic: {
            title: '',
            //noNewEdit: true,
            components: {
                password: false,
                button: false,
                container: true,
                datetime: true,
                radio: false,
                select: false,
                selectboxes: false,
                checkbox: false
            }
        },
        advanced: false,
        data: false,
        layout: false,
        premium: false,

    },
    editForm: {
        textfield: hideShowFormComponentConfig,
        textarea: hideShowFormComponentConfig,
        number: hideShowFormComponentConfig,
        select: hideShowFormComponentConfig,
        selectboxes: hideShowFormComponentConfig,
        checkbox: hideShowFormComponentConfig,
        radio: hideShowFormComponentConfig,
        container: hideShowFormComponentConfig
    }
};


