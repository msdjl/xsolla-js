module.exports = {
    getPromotionResponse: {
        properties: {
            id: {
                type: "integer",
                minimum: 1
            },
            project_id: {
                type: "integer",
                minimum: 1
            },
            technical_name: {
                type: "string",
                minLength: 1
            },
            label: { $ref: "#/definitions/localizations" },
            name: { $ref: "#/definitions/localizations" },
            description: { $ref: "#/definitions/localizations" },
            read_only: { type: "boolean" },
            enabled: { type: "boolean" }
        },
        definitions: {
            localizations: {
                type: "object",
                patternProperties: {
                    "^[a-z]{2}$": {
                        type: "string",
                        minLength: 1
                    }
                }
            }
        },
        required: ["id", "project_id", "technical_name", "label", "name", "description", "read_only", "enabled"]
    },
    getAllPromotionsResponse: {
        type: "array",
        items : {
            type: "object",
            properties: {
                id: {
                    type: "integer",
                    minimum: 1
                },
                project: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer",
                            minimum: 1
                        },
                        localized_name: {
                            type: "string",
                            minLength: 1
                        }
                    },
                    required: [ "id", "localized_name" ]
                },
                technical_name: {
                    type: "string",
                    minLength: 1
                },
                read_only: { type: "boolean" },
                enabled: { type: "boolean" },
                datetime: {
                    anyOf: [
                        {
                            type: "null"
                        },
                        {
                            type: "object",
                            properties: {
                                from: {
                                    type: "string",
                                    minLength: 10
                                },
                                to: {
                                    type: "string",
                                    minLength: 10
                                }
                            },
                            required: [ "from", "to" ]
                        }
                    ]
                },
                is_active: {
                    type: "boolean"
                }
            },
            required: ["id", "project", "technical_name", "read_only", "enabled", "datetime", "is_active"]
        }
    },
    createPromotionResponse: {
        properties: {
            id: {
                type: "integer",
                minimum: 1
            }
        },
        required: ["id"]
    }
};