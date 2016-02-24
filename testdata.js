module.exports = function (creds) {
    return {
        correctPromotionsOpts: [
            {
                description: 'only required fields filled',
                options: {
                    technical_name: 'technical name',
                    project_id: creds.project_id
                }
            },
            {
                description: 'one of localization fields filled',
                options: {
                    technical_name: 123,
                    project_id: creds.project_id,
                    label: {
                        en: 'some label here'
                    }
                }
            },
            {
                description: 'all localization fields filled',
                options: {
                    technical_name: 0,
                    project_id: creds.project_id,
                    label: {
                        en: 'some label here'
                    },
                    name: {
                        en: 'some name here'
                    },
                    description: {
                        en: 'some description here'
                    }
                }
            },
            {
                description: 'all localization fields filled with some number of languages',
                options: {
                    technical_name: "привет",
                    project_id: creds.project_id,
                    label: {
                        en: 'some label here',
                        ru: 'рандомный текст'
                    },
                    name: {
                        en: 'some name here',
                        ru: 'рандомный текст'
                    },
                    description: {
                        en: 'some description here'
                    }
                }
            }
        ],
        incorrectPromotionsOpts: [
            {
                description: 'technical_name is empty',
                options: {
                    technical_name: '',
                    project_id: creds.project_id
                }
            },
            {
                description: 'technical_name is null',
                options: {
                    technical_name: null,
                    project_id: creds.project_id
                }
            },
            {
                description: 'there is no technical_name',
                options: {
                    project_id: creds.project_id
                }
            },
            {
                description: 'project_id is wrong',
                options: {
                    technical_name: 'test',
                    project_id: creds.project_id + 1
                }
            },
            {
                description: 'there is no project_id',
                options: {
                    technical_name: 'test'
                }
            },
            {
                description: 'project_id is null',
                options: {
                    technical_name: 'test',
                    project_id: null
                }
            }
        ]
    }
};