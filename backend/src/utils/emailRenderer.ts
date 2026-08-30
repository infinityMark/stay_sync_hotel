import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';

// Root directory of template files
const TEMPLATES_DIR = path.join(__dirname, '../templates');

/**
 * Render email HTML
 * @param templateName Template file name (e.g., 'welcome.hbs')
 * @param variables Data object to replace placeholders
 * @returns Complete HTML string after rendering
 */
export const renderEmail = (templateName: string, variables: Record<string, any>): string => {
    const templatePath = path.join(TEMPLATES_DIR, templateName);
    const source = fs.readFileSync(templatePath, 'utf-8');

    const compiledTemplate = handlebars.compile(source);

    return compiledTemplate(variables);
};
