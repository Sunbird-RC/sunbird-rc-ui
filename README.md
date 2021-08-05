# NDEAR Front-end

Configurable Angular front end with generic forms and layouts for open saber back end

## Installation

Run `npm install` or `npm ci` to install the necessary dependencies.

## Development server

Run `npm start` for a dev server. Navigate to [http://localhost:4200/](http://localhost:4200/). The app will automatically reload if you change any of the source files.

## Proxy configuration

To avoid CORS issues you can use proxy configuration.
Run `npm start` or `ng serve --proxy-config proxy.conf.json`

For additional configuration please check `proxy.conf.json` file.

## Build

Run `npm build` to build the project. The build artifacts will be stored in the `dist` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `npm e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Customizations

For this showcase we hardcoded the schemas (`app/forms/forms.json`, `app/layouts/layouts.json`). You can replace them with your own or handle them completely dynamically.

In `app.module.ts` we customized the validation and executed a manual resolving step before handing the schemas over to JSON Forms. These steps are optional and can be skipped if needed.

## Generic Form Example

Let's create a registry of employees and employers

`Employees` add and edit their Experience and `Employers` attest it.

We can get Employee and Employer schema created as per model from open saber

Replace `schemaUrl` in `environments/environment.ts` and `environments/environment.prod.ts` (for production only)

### app/forms/forms.json

```json
{
    "type": "opensaberLayoutSchema",
    "version": "0.1",
    "forms": [
                {
                    "employer-signup": {
                        "api": "/Employer/invite",
                        "type": "entity",
                        "formclass":"row",
                        "title": "Sign up / Create new account",
                        "fieldsets": [
                            {
                                "definition": "Employer",
                                "fields": [
                                    {
                                        "name":"identityDetails",
                                        "children": {
                                            "definition": "IdentityDetails",
                                            "title": false,
                                            "fields": [
                                                {
                                                    "name": "fullName",
                                                    "required": true
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        "name":"contactDetails",
                                        "children": {
                                            "definition": "ContactDetails",
                                            "title": false,
                                            "fields": [
                                                {
                                                    "name": "email",
                                                    "required": true
                                                },
                                                {
                                                    "name": "mobile",
                                                    "required": true
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        ],
                        "redirectTo":"/profile/employer"
                    }
                },
                {
                    "employer-setup": {
                        "api": "/Employer",
                        "type": "entity",
                        "redirectTo":"/profile/employer",
                        "fieldsets": [
                            {
                                "definition": "Employer",
                                "fields": [
                                    {
                                        "name":"contactDetails"
                                    },
                                    {
                                        "name":"identityDetails",
                                        "children":{
                                            "definition": "IdentityDetails",
                                            "title": false,
                                            "fields": [
                                                {
                                                    "name": "fullName",
                                                    "required": true
                                                },
                                                {
                                                    "name": "gender",
                                                    "required": true
                                                },
                                                {
                                                    "name": "dob",
                                                    "required": true,
                                                    "type": "date"
                                                },
                                                {
                                                    "name": "identityType",
                                                    "required": true
                                                },
                                                {
                                                    "name": "identityValue",
                                                    "required": true
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                },
                {
                    "employee-signup": {
                        "api": "/Employee/invite",
                        "type": "entity",
                        "formclass":"row",
                        "title": "Sign up / Create new account",
                        "fieldsets": [
                            {
                                "definition": "Employee",
                                "fields": [
                                    {
                                        "name":"identityDetails",
                                        "children": {
                                            "definition": "IdentityDetails",
                                            "title": false,
                                            "fields": [
                                                {
                                                    "name": "fullName",
                                                    "required": true
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        "name":"fresher",
                                        "custom":true,
                                        "element":{
                                            "title": "Are you fresher?",
                                            "enum": [
                                            "Yes",
                                            "No"
                                            ],
                                            "widget": {
                                            "formlyConfig": {
                                                "type": "radio",
                                                "fieldGroupClassName":"controls",
                                                "className": "radio"
                                            }
                                            }
                                        }
                                    },
                                    {
                                        "name":"lastCompanyName",
                                        "custom":true,
                                        "element":{
                                            "title": "Last company name",
                                            "widget": {
                                                "formlyConfig": {
                                                    "type": "input",
                                                    "expressionProperties": {
                                                        "hide": "!model.fresher || model.fresher === 'No'"
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        "name":"contactDetails",
                                        "children": {
                                            "definition": "ContactDetails",
                                            "title": false,
                                            "fields": [
                                                {
                                                    "name": "email",
                                                    "required": true
                                                },
                                                {
                                                    "name": "mobile",
                                                    "required": true
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        ],
                        "redirectTo":"/profile/employee"
                    }
                },
                {
                    "employee-experience": {
                        "api": "/Employee",
                        "type": "property:experience",
                        "redirectTo":"/profile/employee"
                        "fieldsets": [
                            {
                                "definition": "Experience",
                                "fields": ["*"]
                            }
                        ]
                    }
                },
            ]
}
```

`formUrl = {baseUrl}/forms/:route`

`form = forms[route]`

Key | Value
------------ | -------------
`form.api` | URL Path of API
`form.type` | Type of form `entity` or `property:<property name>`
`form.formclass` | Class of form
`form.title` | Title of form
`form.redirectTo` | Redirect URL on after form submit
`form.fieldsets` | Array/List of fieldsets(multiple) to populate in `form`.


>`fieldsets`

Key | Value
------------ | -------------
`fieldsets.definition` | Defination of fields from JSON Schemas in `schemaUrl`
`fieldsets.fields` | Array/List of fields(multiple) to populate in `fieldsets`


>`fields`

Key | Value
------------ | -------------
`[*]` | This will take all fields from JSON Schemas in `schemaUrl`
`fields.name` | Name of field (same as defined in defination of that schema)
`fields.custom` | `boolean` Name of custome field (not defined in defination of that schema)
`fields.required` | `boolean`
`fields.class` | Class of field
`fields.disabled` | `boolean` Disable the field (readonly)
`fields.children` | `object` Reference field of defination (same properties as `fieldsets`)
`fields.validation` | Ex. 
```json 
                                {
                                    "pattern": "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$",
                                    "message": "GSTIN is not valid. Ex: 06BZAHM6385P6Z2"
                                }
```     

### app/layouts/layouts.json

```json
{
    "type": "opensaberLayoutSchema",
    "version": "0.1",
    "layouts": [
        {
            "employer": {
                "api": "/Employer",
                "title": "Employer Profile",
                "blocks": [
                    {
                        "definition": "Employer",
                        "title": "Basic details",
                        "add": false,
                        "edit": true,
                        "editform":"employer-setup",
                        "fields": {
                            "includes": ["*"]
                        }
                    }
                ]
            }
        },
        {
            "employee": {
                "api": "/Employee",
                "title": "Employee Profile",
                "blocks": [
                    {
                        "definition": "Employee",
                        "title": "Basic details",
                        "add": false,
                        "edit": false,
                        "fields": {
                            "includes": ["*"],
                            "excludes": ["experience"]
                        }
                    },
                    {
                        "definition": "Experience",
                        "title": "Experience details",
                        "add": true,
                        "addform":"employee-experience",
                        "edit": false,
                        "multiple": true,
                        "fields": {
                            "includes": ["experience"]
                        }
                    }
                ]
            }
        }
    ]
}
```

`layoutUrl = {baseUrl}/profile/:route`

`layout = layouts[route]`

Key | Value
------------ | -------------
`layout.api` | URL Path of API
`layout.title` | Title of form
`layout.blocks` | Cards/Blocks (multiple) to populate in `layout`.

>`blocks`

Key | Value
------------ | -------------
`blocks.definition` | Defination of fields from JSON Schemas in `schemaUrl`
`blocks.title` | Title of Card/Block
`blocks.add` | `boolean` Enable Add Button
`blocks.addform` | `<name of form from forms>` Form opens on Add Button click
`blocks.edit` | `boolean` Enable Edit Button
`blocks.editform` | `<name of form from forms>` Form opens on Edit Button click
`blocks.multiple` | `boolean` Enable Multiple values
`blocks.fields` | Array/List of fields(multiple) to populate in `fieldsets`


>`fields`

Key | Value
------------ | -------------
`fields.includes` | Array/list of Included Fields from response or [*]
`fields.excludes` | Array/list of Excluded Fields from response