
export const matchString = (string1: string, string2: string, caseSensitive: boolean = true ) => {
    if(caseSensitive){
        return (string1 === string2);
    }else {
        return (string1.toLowerCase() === string2.toLowerCase());
    }
}

export const getAvatarText = (string: string = '') => {
    return (string ? string.toUpperCase().charAt(0) : 'A');
}

export const getName = (firstName: string = '', lastName: string = '' ) => {
    return (`${firstName}${lastName?' '+lastName: ''}`);
}

export const getFullName = (firstName: string = '', middleName: string = '', lastName: string = '' ) => {
    return (`${firstName}${middleName?' '+middleName: ''}${lastName?' '+lastName: ''}`);
}

export const getCompleteAddress = (address: Array<String> = [], joiner: string = ', ') => {
    return (address.join(joiner));
}

export const getTransformedText = (text: string = '', casing: string = 'capitalize') => {
    if (casing === 'upper')
        return text.toUpperCase();
    else if (casing === 'upper')
        return text.toLowerCase();
    else
        return (text.split(' ').map(e => e.charAt(0).toUpperCase()+e.substring(1)).join(' '));
}

export const getEmptyText = (text: string = '', emptyText: string = 'No Data Found') => {
    if (text && text.length > 0)
        return text;
    else
        return emptyText;
}

export const getTrimmedText = (text: string = '') => {
    return text.trimEnd();
}

export const formateString = (text:string) =>{
    const wordsArray = text?.split('_');
    const capitalizedWords = wordsArray?.map(word => {
      return word?.charAt(0)?.toUpperCase() + word.slice(1);
    });
    return capitalizedWords.join(' ');
}
export const formatLink = (text:string) =>{
    let enFileImg = text;
    let pathPart = enFileImg.split("/");
    let filename = pathPart[pathPart.length - 1];
    let filenameMatch 
  return  filenameMatch = filename.split('_')[1]
}