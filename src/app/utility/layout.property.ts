import * as _ from "lodash-es";

function getDefinitionForKey(element: string, rootDefinition: JSON, definitions: JSON) {
    let elementDef = _.get(rootDefinition, element);
    if (rootDefinition && ['object', 'json'].includes(_.get(rootDefinition, 'type'))) {
        elementDef = _.get(rootDefinition, ['properties', element]);
        if (!elementDef) elementDef = _.get(rootDefinition, ['properties', element]);
    } else if (rootDefinition && _.get(rootDefinition, 'type') === 'array') {
        elementDef = _.get(rootDefinition, ['items', 'properties', element]);
        if (!elementDef) elementDef = _.get(rootDefinition, ['items']);
    }
    if (!elementDef) {
        elementDef = _.get(definitions, element);
    }
    if (elementDef && '$ref' in elementDef) {
        let path = elementDef['$ref'].split("#/definitions/").pop().split("/");
        elementDef = _.get(definitions, [...path]);
    } else if (elementDef?.items && '$ref' in elementDef.items) {
        let path = elementDef.items['$ref'].split("#/definitions/").pop().split("/");
        elementDef.items = _.get(definitions, [...path]);
    } else if (elementDef?.properties && '$ref' in elementDef.properties) {
        let path = elementDef.properties['$ref'].split("#/definitions/").pop().split("/");
        elementDef.properties = _.get(definitions, [...path]);
    }

    return elementDef;
}

function processIncludes(includes, data) {
    if (!data || typeof data !== 'object') return data;
    if (includes.some(path => path.length == 1 && path[0] == '*')) return data;
    const result = {};
    includes.forEach(path => {
        if (path[0] === '*') {
            for (let key in data) {
                if (typeof data[key] == 'object') {
                    result[key] = processIncludes([path.slice(1)], data[key])
                }
            }
        }
        else if (path.length === 1) {
            if (path[0].endsWith(']')) {
                let filterKey = path[0].split('[')[0];
                let filterIndex = path[0].split('[')[1].split(']')[0];
                result[filterKey] = data[filterKey].filter((d, i) => i == filterIndex);
            } else {
                result[path[0]] = data[path[0]];
            }
        } else if (Array.isArray(data[path[0]]) || path[0].endsWith(']')) {
            let filterIndex = -1;
            let filterKey = path[0];
            if (path[0].endsWith(']')) {
                filterKey = path[0].split('[')[0];
                filterIndex = path[0].split('[')[1].split(']')[0];
            }
            let arr = data[filterKey].filter((d, i) => filterIndex == -1 || i == filterIndex).map((d, i) => {
                return merge(_.get(result[filterKey], i), processIncludes([path.slice(1)], d))
            });
            result[filterKey] = arr;
        } else {
            let processed = processIncludes([path.slice(1)], data[path[0]]);
            result[path[0]] = merge(result[path[0]], processed);
        }
    });
    return result;
}

function processExcludes(includes, data) {
    if (!data || typeof data !== 'object') return undefined;
    if (includes.some(path => path.length == 1 && path[0] == '*')) {
        return Array.isArray(data) ? [] : {};
    }
    let result = _.cloneDeep(data);
    includes.forEach(path => {
        if (path[0] === '*') {
            if (path.length == 1) {
                for (let key in data) {
                    delete result[key];
                }
            } else {
                for (let key in data) {
                    if (typeof data[key] == 'object') {
                        result[key] = processExcludes([path.slice(1)], data[key])
                    }
                }
            }
        } else if (path.length === 1) {
            if (path[0].endsWith(']')) {
                let filterKey = path[0].split('[')[0];
                let filterIndex = path[0].split('[')[1].split(']')[0];
                if (filterIndex === '*') result[filterKey] = [];
                else {
                    result[filterKey] = result[filterKey].filter((d, i) => i != filterIndex);
                }
            } else {
                delete result[path[0]];
            }
        } else if (Array.isArray(data[path[0]]) || path[0].endsWith(']')) {
            let filterIndex = -1;
            let filterKey = path[0];
            if (path[0].endsWith(']')) {
                filterKey = path[0].split('[')[0];
                filterIndex = path[0].split('[')[1].split(']')[0];
            }
            let arr = data[filterKey].map((d, i) => {
                if (filterIndex !== -1 && filterIndex != i) return d;
                return intersection(_.get(result[filterKey], i), processExcludes([path.slice(1)], d))
            });
            result[filterKey] = arr;
        } else {
            let processed = processExcludes([path.slice(1)], data[path[0]]);
            result[path[0]] = intersection(result[path[0]], processed);
        }
    });
    return result;
}

function merge(data, processed) {
    if (!data) data = {};
    for (let key in processed) {
        if (!data[key]) {
            data[key] = processed[key];
            continue;
        }
        if (typeof data[key] == 'object') {
            data[key] = merge(data[key], processed[key]);
        }
    }
    return data;
}

function intersection(data, processed) {
    if (!data) data = {};
    for (let key in data) {
        if (!processed[key]) {
            delete data[key];
        }
        if (typeof processed[key] == 'object') {
            data[key] = intersection(data[key], processed[key]);
        }
    }
    return data;
}


function processProperties(data, def1, def2, title, arr, isMulti = false, addProps, depth = 1) {
    let def = getDefinitionForKey(title, def1, def2);
    if (!def) return;
    if (Array.isArray(data)) {
        let flag = ['object', 'array', 'json'].includes(_.get(def, ["items", "type"]));
        arr.push({
            property: title,
            ...def,
            value: !flag ? data : [], isMulti,
            ...addProps
        })
        if (flag) {
            data.forEach(d => {
                const arrData = [];
                processProperties(d, def, def2, title, depth < 2 ? arrData : arr, true, addProps, depth + 1);
                if (depth < 2) arr.push(arrData);
            })
        }
    } else if (typeof data === 'object') {
        let postData = Object.keys(data).reduce((res, item) => {
            if (item.startsWith("_") || item === "osid") {
                return ({
                    ...res, add: {
                        ...res.add,
                        [item]: data[item],
                    }
                });
            }
            return ({ ...res, rest: { ...res.rest, [item]: data[item] } });
        }, { add: {}, rest: {} });
        for (let key in data) {
            processProperties(data[key], def, def2, key, arr, isMulti, { ...postData.add, ...addProps }, depth);
        }
    } else if (def?.type === "json") {
        data = JSON.parse(data);
        for (let key in data) {
            processProperties(data[key], def, def2, key, arr, isMulti, addProps, depth);
        }
    } else if (def) {
        arr.push({ property: title, ...def, value: data, isMulti, ...addProps });
    }
}

function processFirstShow(property, block) {
    if (block.hasOwnProperty('propertyShowFirst') && property.length) {
        if (property[0].length) {
            return property.map(d => processFirstShow(d, block));
        }
        let fieldsArray = property;
        let fieldsArrayTemp = [];
        for (let i = 0; i < block.propertyShowFirst.length; i++) {
            fieldsArray = fieldsArray.filter(function (obj) {
                if (obj.property === block.propertyShowFirst[i]) {
                    fieldsArrayTemp.push(obj);
                }
                return obj.property !== block.propertyShowFirst[i];
            });
        }
        return fieldsArrayTemp.concat(fieldsArray);
    }
    return property;
}

function tokenize(arr) {
    if (!arr) return [];
    return arr.map(d => d.split("."));
}

export function processUIPropertiesData(data, definitions, block) {
    const tokenizedIncludes = tokenize(block?.fields?.includes);
    const tokenizedExcludes = tokenize(block?.fields?.excludes);
    const includedData = processIncludes(tokenizedIncludes, data);
    const excludedData = processExcludes(tokenizedExcludes, includedData);
    const results = [];
    processProperties(excludedData, definitions, definitions, block?.definition, results, false, null);
    return processFirstShow(results, block);
}