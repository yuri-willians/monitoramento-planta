import {StyleSheet} from 'react-native';
import metrics from '../src/styles/metrics';
import colors from '../src/styles/colors';
import fonts from '../src/styles/fonts';

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        height: '100%',
    },

    containerHeader: {
        backgroundColor: colors.white,
        height: metrics.headerHeight,
        paddingTop: metrics.headerPadding + 10,
        flexDirection: 'row',
        elevation: 24,
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    icon: {
        color: colors.darker,
        margin: metrics.padding,
    },

    title: {
        flex: 1,
        fontSize: fonts.bigger,
        marginTop: metrics.padding,
        alignSelf: 'center',
    },

    status: {
        flex: 1,
        fontSize: fonts.bigger,
        alignSelf: 'center',
        marginLeft: 20,
    },

    status_offline: {
        color: colors.red,
        fontSize: fonts.big,
        marginTop: metrics.padding,
    },

    status_online: {
        color: colors.green,
        fontSize: fonts.big,
        marginTop: metrics.padding,
    },

    info: {
        backgroundColor: colors.white,
        height: metrics.headerHeight,
        paddingTop: metrics.headerPadding,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        borderBottomEndRadius: 35,
        borderBottomStartRadius: 35,
        elevation: 24,
        paddingBottom: metrics.headerPadding,
    },

    temperature: {
        fontSize: fonts.big,
        color: colors.red,
        paddingLeft: metrics.padding,
    },

    humidity: {
        fontSize: fonts.big,
        color: colors.blue,
    },

    values: {
        fontSize: fonts.bigger,
    },

    unit: {
        fontSize: fonts.smaller,
        color: colors.light,
    },

    containerTabs: {
        backgroundColor: colors.white,
        height: metrics.tabHeight,
        width: '100%',
        paddingTop: metrics.tabPadding,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        elevation: 24,
        opacity: 0.6,
    },

    subtext: {
        fontSize: fonts.regular,
        alignSelf: 'center',
    },

    maintext: {
        fontSize: fonts.bigger,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        alignSelf: 'center',
    },

    containerBody: {
        flex: 2,
        backgroundColor: colors.light,
    },

    containerPlotTemperature: {
        paddingTop: metrics.headerPadding + 10,
        // flexDirection: 'row',
        elevation: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },

    updateButton: {
        alignSelf: 'center',
    },
});

export default styles;
