import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Home from './pages/Home';
import Selection from './pages/Selection';
import Info from './pages/Info';

const Stack = createStackNavigator();

export default function Routes() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={Home}/>
            <Stack.Screen name="Selection" component={Selection}/>
            <Stack.Screen name="Info" component={Info}/>
        </Stack.Navigator>
    );
}