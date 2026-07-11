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

export { mergeData };