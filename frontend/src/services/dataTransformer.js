const mergeData = (countries, favorites) => {
    return countries.map(country => {

        const favorite = favorites.find(f => Number(f.api_id) === Number(country.codes.ccn3));

        return {
            ...country,
            isFavorite: !!favorite,
            id: favorite ? favorite.id : null
        };
    });
};

const buildCountryStats = (country, drivingSideLabels) => [
    { label: 'Capitale', value: country.capitals?.[0]?.name },
    { label: 'Popolazione', value: country.population?.toLocaleString() },
    { label: 'Superficie', value: country.area?.kilometers ? `${country.area.kilometers.toLocaleString()} km²` : null },
    { label: 'Regione', value: [country.region, country.subregion].filter(Boolean).join(' · ') || null },
    { label: 'Lingue', value: country.languages?.length ? country.languages.map((l) => l.name).join(', ') : null },
    { label: 'Valute', value: country.currencies?.length ? country.currencies.map((c) => `${c.name} (${c.symbol})`).join(', ') : null },
    { label: 'Fusi orari', value: country.timezones?.length ? country.timezones.join(', ') : null },
    { label: 'Prefisso', value: country.calling_codes?.length ? country.calling_codes.map((c) => `+${c}`).join(', ') : null },
    { label: 'Guida', value: drivingSideLabels[country.cars?.driving_side] ?? null },
    { label: 'Dominio', value: country.tlds?.length ? country.tlds.join(', ') : null },
    { label: 'Codice ISO2', value: country.codes?.alpha_2 },
    { label: 'Codice ISO3', value: country.codes?.alpha_3 }
].filter((stat) => stat.value);

const buildCountryMemberships = (country, membershipLabels) =>
    Object.entries(country.memberships || {})
        .filter(([, active]) => active)
        .map(([key]) => membershipLabels[key] || key);

const buildCountryExternalLinks = (country, linkLabels) =>
    Object.entries(country.links || {})
        .filter(([key, href]) => linkLabels[key] && href)
        .map(([key, href]) => ({ label: linkLabels[key], href }));

export { mergeData, buildCountryStats, buildCountryMemberships, buildCountryExternalLinks };