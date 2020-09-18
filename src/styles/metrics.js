import {Platform} from 'react-native';

export default {
    padding: 15,
    ...Platform.select({
        ios: { headerHeight: 120, headerPadding: 20 },
        android: { headerHeight: 100, headerPadding: 0 },
    }),
    ...Platform.select({
        ios: { tabHeight: 100, tabPadding: 20 },
        android: { tabHeight: 80, tabPadding: 0 },
    }),
};