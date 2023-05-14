const index = {
  debounce(fn: Function, delay: number) {
    let timeoutID: any = null
    return function () {
      clearTimeout(timeoutID)
      // eslint-disable-next-line prefer-rest-params
      const args = arguments
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this
      timeoutID = setTimeout(function () {
        fn.apply(that, args)
      }, delay)
    }
  },

  getSituationBadgeLabel(situationRank: number): string {
    if (!situationRank) {
      return '';
    }
    let label = `${situationRank}/4 - `
    label += this.getSituationLabel(situationRank)
    return label;
  },
  
  getSituationLabel(situationRank: number): string {
    if (!situationRank) {
      return '';
    }
    let label = '';
    switch (situationRank) {
      case 1:
        label += 'En état de vigilance';
        break;
      case 2:
        label += `En état d'alerte`;
        break;
      case 3:
        label += `En état d'alerte renforcé`;
        break;
      case 4:
        label += `En état de crise`;
        break;
    }
    return label;
  }
}

export default index;