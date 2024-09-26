import moment from 'moment';

const commputeCommuneMap = (e) => {
  const { communesData, depsSelected, dateBegin, dateEnd } = e;

  const momentDateBegin = moment(dateBegin, 'YYYY-MM-DD');
  const momentDateEnd = moment(dateEnd, 'YYYY-MM-DD');

  const communesFiltered = depsSelected && depsSelected.length > 0 ? communesData.filter((commune) => {
    return depsSelected.includes(getDepartementCode(commune.code));
  }) : communesData;

  const communeDataReturned = [];
  const departementData = [];

  for (const commune of communesFiltered) {
    const ponderation = commune.restrictions
      .filter((r) => {
        return moment(r.d, 'YYYY-MM').isSameOrAfter(momentDateBegin) && moment(r.d, 'YYYY-MM').isSameOrBefore(momentDateEnd);
      })
      .reduce((acc, value) => acc + (value.p ? value.p : 0), 0);

    communeDataReturned.push({
      code: commune.code,
      ponderation: ponderation,
    });

    const depCode = getDepartementCode(commune.code);
    const index = departementData.findIndex(d => d.code === depCode);
    if (index < 0) {
      departementData.push({
        code: depCode,
        ponderations: [ponderation],
      });
    } else {
      departementData[index].ponderations.push(ponderation);
    }
  }

  for (const departement of departementData) {
    departement.ponderation = Math.round(
      departement.ponderations.reduce((acc, value) => acc + value, 0) / departement.ponderations.length
    );
    delete departement.ponderations;
  }

  // Envoyer le résultat au thread principal
  return{ communeDataReturned, departementData };
};

const getDepartementCode = (codeInsee) => {
  let toReturn = codeInsee.slice(0, 2);
  if (toReturn === '97' || toReturn === '98') {
    toReturn = codeInsee.slice(0, 3);
  }
  return toReturn;
}

self.addEventListener('message', function(e) {
  let data = commputeCommuneMap(e.data)
  self.postMessage(data);
}, false);