import { bsAbbr, bsFormat } from '@utils/currency';
import Currency from './currency';

const BsCurrency = new Currency({
    abbr: bsAbbr,
    name: 'Bolivares Soberanos',
    format: bsFormat
});

export default BsCurrency;
