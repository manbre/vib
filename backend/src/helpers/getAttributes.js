/**
 * @param Model
 * @returns distinct genres
 */
const getGenres = async (Model) => {
  try {
    let genres = await Model.findAll();
    //
    //get data out of json
    let all = [];
    for (let i = 0; i < genres.length; i++) {
      let str = genres[i].genre;
      all.push(str);
    }
    //eliminates ", "
    let withoutBlank = all.toString().split(", ");
    let withoutComma = withoutBlank.toString().split(",");
    //eliminates duplicates and spaces
    let distinct = [];
    for (let i = 0; i < withoutComma.length; i++) {
      let str = withoutComma[i];
      if (!distinct.includes(withoutComma[i]) && withoutComma[i] !== "") {
        distinct.push(str);
      }
    }
    //in alphabetical order
    distinct.sort();
    return distinct;
  } catch (err) {
    console.log({ error: err.message });
  }
};

/**
 * @param Model
 * @returns distinct fsks
 */
const getFsks = async (Model) => {
  try {
    let fsks = await Model.findAll();
    //
    //get data out of json
    let all = [];
    for (let i = 0; i < fsks.length; i++) {
      let str = fsks[i].fsk;
      all.push(str);
    }
    return all;
  } catch (err) {
    console.log({ error: err.message });
  }
};

/**
 * @param Model
 * @returns distinct series
 */
const getSeries = async (Model) => {
  try {
    let series = await Model.findAll();
    //
    //get data out of json
    let all = [];
    for (let i = 0; i < series.length; i++) {
      let str = series[i].series;
      all.push(str);
    }
    return all;
  } catch (err) {
    console.log({ error: err.message });
  }
};

module.exports = {
  getGenres,
  getFsks,
  getSeries,
};
