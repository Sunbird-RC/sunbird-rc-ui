# Sunbird-RC UI

Configurable Angular front end with generic forms and layouts for Sunbird RC

# Community Discussions & Issue Reporting
Please use the community repo for reporting issues & participating in discussions

# Installation & Configuration

## Installation
This is an Angular 8 project, and you need to install the dependencies, and run the project. 

## Configuration
The application needs to be configured with the appropriate fields to be able to use it. Example configuration is provided in the `src/examples` folder.

### Environment Config

Key | Value
------------          | -------------
`baseUrl`             | Base URL for the Sunbird RC backend. Eg: https://registry.com/api
`schemaUrl`           | URL to the OpenAPI schema definition. This could be a HTTP path or a path to a local file Eg: https://registry.com/api/schema.json OR /assets/schema.json
`logo`                | URL to logo. This logo is displayed in the header of the UI


### Forms
The `forms.json` needs to be placed in `src/assets/config`. This file defines the schema for various forms used, along with the fields for each. The form rendering is based on the formly.dev library, and the forms.json is a small wrapper on top of the formly schema.

In this file `forms` is an array with key/value pairs. They key is the code / slug of the form which is used to access the form. Eg: if the key for a form is `employee-signup` that form can be accessed via `/forms/employee-signup`. Each form definition will have the below fields - 

Key | Value
------------          | -------------
`form.api`            | This is the path to the API endpoints for the entity this form handles. Eg: `/Employer`
`form.type`           | Forms can be of 2 types. It can either be a form to create a new entity Eg: Employer, or it could be a form to submit a "sub-field" eg: work experience of an employee. For the former use `entity`. For the latter use `property:<property name>` (eg: property:work_experience)
`form.formclass`      | HTML Class applied to the form container
`form.title`          | Title of form
`form.redirectTo`     | Redirect URL on after form submit
`form.fieldsets`      | List of fieldsets(multiple) for this form. At least one fieldset is needed
`form.langKey`      | This is the name of key, which contains the all language constants strings for this form in the en-local.json file. Eg:  <br>  **form.json:** <pre> {<br> "langKey": "instituteLang"  <br>} </pre>  **en-local.json:** <pre> { <br> 'instituteLang' : { <br> ..language constants.. <br>} <br> } </pre>

**fieldsets**

Key | Value
------------ | -------------
`fieldsets.definition` | Name of the OpenAPI "Definition" to use
`fieldsets.fields` | List of fields(multiple) to populate for this fieldset. If you wish to display all fields from the schema, you can skip defining each field, and use use `"fields": ["*"]`


**fields**

Key | Value
------------ | -------------
`fields.name` | Name of field (same as defined in defination of that schema)
`fields.custom` | `boolean` Name of custome field (not defined in defination of that schema)
`fields.required` | `boolean`
`fields.class` | Class of field
`fields.disabled` | `boolean` Disable the field (readonly)
`fields.children` | `object` Reference field of defination (same properties as `fieldsets`)
`fields.validation` | <pre>{<br>&nbsp;&nbsp;"pattern": "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$",<br>&nbsp;&nbsp;"message": "GSTIN is not valid. Ex: 06BZAHM6385P6Z2<br>}</pre>

### Layouts
The `layouts.json` is used to define how the public and private profile pages look like. For each entity in OpenSaber backend, a layout file should be defined with the fields and the order in which they should display. 

In this file `layouts` is an array with key/value pairs. They key is the code / slug of the layout page which is used to access the form. Eg: if the key for a layout is `employee-profile` that page can be accessed via `/profile/employee-profile`. Each layout definition will have the below fields - 

Key | Value
------------    | -------------
`layout.api`    | URL Path of API
`layout.title`  | Title of form
`layout.blocks` | Cards/Blocks (multiple) to populate in `layout`.
`layout.langKey`      | This is the name of key, which contains the all language constants strings for this layout in the en-local.json file. Eg:  <br>  **layout.json:** <pre> {<br> "langKey": "instituteLang"  <br>} </pre>  **en-local.json:** <pre> { <br> 'instituteLang' : { <br> ..language constants.. <br>} <br> } </pre>

**blocks**

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


**fields**

Key | Value
------------ | -------------
`fields.includes` | Array/list of Included Fields from response or `[*]` for all fields
`fields.excludes` | Array/list of Excluded Fields from response

### Search
The `search.json` needs to be placed in `src/assets/config`. In this file defines the tabs, filters and result cards attribute names which are displayed on the discovery page.


In this file `searches` is an array with key/value pairs. Each search definition will have the below fields -

Key | Value
------------    | -------------
`search.tab`    |  Key name of tab
`search.tabTitle`  | Title of tab
`search.api`    | URL Path of API
`search.activeTab` | Set active tab as a default.

**filters**

Key | Value
------------ | -------------
`filters.key` | unique key of filter/property
`filters.title` | Title of filter
`filters.type` | Type of filter
`filters.propertyPath` | Actul path of property in your api responce
`filters.default` | Set filter as default
`filters.placeholder` | Set placeholder in the filter input box

**fields**

Key | Value
------------ | -------------
`fields.title` | Title of field 
`fields.property` | Set property path in you api responce (eg : "address.district" )
`fields.attest` | Set state check property key name 

# Examples

You can find examples of config files [here](https://github.com/ref-registries)


# FAQs

## Proxy configuration
To avoid CORS issues you can use proxy configuration. Run `npm start` or `ng serve --proxy-config proxy.conf.json`. For additional configuration please check `proxy.conf.json` file.

