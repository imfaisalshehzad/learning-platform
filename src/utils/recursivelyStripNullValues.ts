import slugify from "slugify";

export function recursivelyStripNullValues(value: any): unknown {
    if (Array.isArray((value))) {
        return value.map(recursivelyStripNullValues);
    }

    if (value !== null && typeof value === 'object') {
        if (value instanceof Date) {
            return value;
        }

        return Object.fromEntries(
            Object.entries(value).map(
                ([key, value]) => [
                    key, recursivelyStripNullValues(value)
                ]
            )
        )
    }

    if (value !== null) {
        return value;
    }


}

export function makeSlugify(value: string) {
    const slug = slugify(value, {
        replacement: '-',
        lower: true,
        strict: true,
        locale: 'en',
        trim: true,
    });

    return slug;
}
