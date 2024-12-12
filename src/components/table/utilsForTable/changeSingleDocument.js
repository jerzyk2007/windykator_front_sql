export const changeSingleDoc = (data) => {
    data.JAKA_KANCELARIA = data.JAKA_KANCELARIA ? data.JAKA_KANCELARIA : "BRAK";
    data.JAKA_KANCELARIA_TU = data.JAKA_KANCELARIA_TU ? data.JAKA_KANCELARIA_TU : "BRAK";
    data.BLAD_DORADCY = data.BLAD_DORADCY ? data.BLAD_DORADCY : "BRAK";
    data.DZIALANIA = data.DZIALANIA ? data.DZIALANIA : "BRAK";
    data.POBRANO_VAT = data.POBRANO_VAT ? data.POBRANO_VAT : "Nie dotyczy";
    return data;
};