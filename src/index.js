import React, { Component } from 'react';
import { Text, View, ScrollView, Dimensions, TouchableHighlight, Button } from 'react-native';
import { Picker } from '@react-native-community/picker';
import LinearGradient from 'react-native-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import { Dialog } from 'react-native-simple-dialogs';
import Icon from 'react-native-vector-icons/Ionicons';
import dgram from 'react-native-udp';
import styles from '../src/styles';
import database from '../src/database';

// Contém os dados sobre a temperatura que devem ser plotados
let data_plot_temperature = {
    labels: ["", "", "", "", "", "", "", "", "", ""],
    datasets: [
    {
        data: [0],
        color: (opacity = 0.75) => `rgba(237, 59, 21, ${opacity})`, // optional
        strokeWidth: 2, // optional
        
    },
    {
        data: [0],
        color: (opacity = 0) => `rgba(0, 0, 0, ${opacity})`, // optional
        strokeWidth: 2, // optional
        
    },
    {
        data: [35],
        color: () => 'rgba(0, 0, 0, 0)',
        strokeWidth: 0, // optional
        
    }
    ],
    legend: ["Temperatura", "Temperatura Ref"], // optional
};

// Contém os dados sobre a umidade que devem ser plotados
let data_plot_humidity = {
    labels: ["", "", "", "", "", "", "", "", "", ""],
    datasets: [
    {
        data: [0],
        color: (opacity = 0.75) => `rgba(47, 65, 176, ${opacity})`, // optional
        strokeWidth: 2, // optional
    },
    {
        data: [500, 500, 500, 500],
        color: (opacity = 0) => `rgba(0, 0, 0, ${opacity})`, // optional
        strokeWidth: 2, // optional
    },
    {
        data: [400, 400, 400, 400],
        color: (opacity = 0) => `rgba(0, 0, 0, ${opacity})`, // optional
        strokeWidth: 2, // optional
    },
    {
        data: [300, 300, 300, 300],
        color: (opacity = 0) => `rgba(0, 0, 0, ${opacity})`, // optional
        strokeWidth: 2, // optional
    },
    {
        data: [200, 200, 200, 200],
        color: (opacity = 0) => `rgba(0, 0, 0, ${opacity})`, // optional
        strokeWidth: 2, // optional
    },
    {
        data: [600],
        color: () => 'rgba(0, 0, 0, 0)',
        strokeWidth: 2, // optional
        
    },
    {
        data: [100],
        color: () => 'rgba(0, 0, 0, 0)',
        strokeWidth: 2, // optional
        
    }
    ],
    legend: ["Umidade", "Umidade Ref"] // optional
};

let data = null;
let check_data = '0';
let data_humidity = ["0", "0", "0", "0"];
let data_temperature = ["0", "0", "0", "0"];
let receive_array = [];
let receive = "";
let temperature = "-";
let humidity = "-";
let status = false;
const screenWidth = Dimensions.get("window").width;

// Configurações para o react-native-chart-kit
const chartConfig = {
    backgroundGradientFrom: "rgba(255, 255, 255, 0)",
    backgroundGradientFromOpacity: 0.25,
    backgroundGradientTo: "rgba(255, 255, 255, 0)",
    backgroundGradientToOpacity: 0.25,
    color: (opacity = 0) => `rgba(0, 0, 0, ${opacity})`, // optional
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
    style: {
        flexDirection: 'row',
        elevation: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
      },
  };

// Gera uma porta aleatória para o receptor
function randomPort() {
    return (Math.random() * 60536) | (0 + 5000); // 60536-65536
}

function toByteArray(obj) {
    var uint = new Uint8Array(obj.length);
    for (var i = 0, l = obj.length; i < l; i++) {
        uint[i] = obj.charCodeAt(i);
    }

    return new Uint8Array(uint);
}

// Connecta e adquire dados do servidor UDP
function connect() {
    let a = dgram.createSocket('udp4');
    let aPort = randomPort();

    a.bind(aPort, function(err) {
        if (err) throw err;
        console.log('a bound to ' + JSON.stringify(a.address()));
    });

    let b = dgram.createSocket('udp4');
    var bPort = randomPort();

    b.bind(bPort, function(err) {
        if (err) throw err;
        console.log('b bound to ' + JSON.stringify(b.address()));
    });

    a.on('message', function(data, rinfo) {
        var str = String.fromCharCode.apply(null, new Uint8Array(data));
        console.log('a received echo ' + str + ' ' + JSON.stringify(rinfo),);
        a.close();
        b.close();
        receive = str;
    });

    b.once('listening', function() {
        var str = "request_data";
        var msg = toByteArray(str);
        a.send(msg, 0, msg.length, 8888, '192.168.15.6', function(err) {
        if (err) throw err;
        console.log('a sent data ', str);
        });
    });
}

// Mantém o gráfico gerado com 4 valores
function addToCircleArray(value, array) {
    for (let i=0; i < array.length; i++) {
        array[i] = array[i+1]
    }
    array.pop();
    array.push(value);
    console.log(array);

    return array;
}

function refConfiguration(data, pos) {
    return [data[pos], data[pos], data[pos], data[pos]];
}

class App extends Component {

    // State para o botão HELP
    openHelp = (show) => {
        this.setState({ showHelp: show });
    }

    // State para o botão INFO
    openInfo = (show) => {
        this.setState({ showInfo: show });
    }

    constructor(props) {
        super (props);

        this.state = {
            pickerSelection: '0'
        }
    }

    // A cada 5 segundos checa se o programa precisa ser remontado 
    componentDidMount() {
        this.myInterval = setInterval(() => {
            this.setState({number: global.state});
        }, 5000);
    }

    // Aplica as mudanças e remonta a aplicação
    shouldComponentUpdate() {
        connect();
        console.log(receive);
        if (receive != null) {
            receive_array = receive.split(",");
            temperature = receive_array[0];
            humidity = receive_array[1];
            status = true;
            receive = null;
            if (Number.isInteger(parseInt(temperature, 10)) && Number.isInteger(parseInt(humidity, 10))) {
                data_temperature = addToCircleArray(parseInt(temperature, 10), data_temperature);
                data_humidity = addToCircleArray(parseInt(humidity, 10), data_humidity);

                data_plot_temperature.datasets[0].data = data_temperature
                data_plot_humidity.datasets[0].data = data_humidity
            }
            if (this.state.pickerSelection != check_data) {
                if (this.state.pickerSelection != '0') {
                    data = database[parseInt(this.state.pickerSelection)];
                    data_plot_temperature.datasets[1].data = refConfiguration(data, 2);
                    data = this.state.pickerSelection;
                } else {
                    data = ['0', '0', '0', '0'];
                    data_plot_temperature.datasets[1].data = refConfiguration(data, 2);
                    check_data = this.state.pickerSelection;
                }
                console.log("Adquirido: ", data);
            } else {
                data = null;
            }
            return true;
        } else {
            data_temperature = ["0", "0", "0", "0"];
            data_humidity = ["0", "0", "0", "0"];
            status = false;
            temperature = "-";
            humidity = "-";
            return true;
        }
        
    }

    componentWillUnmount () {
        clearInterval( this.myInterval );
    }

    render() {
        return (
            // Aplica o efeito gradiente como cor de fundo da aplicação
            <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 1}} colors={['#398E3C', '#337085']} style={styles.container}>
            {/* Header */}
                <View>
                    <View style={styles.containerHeader}>
                        <TouchableHighlight style={{borderRadius: 35}} onPress={() => this.openInfo(true)}>
                                <Icon name="information-circle" size={35} style={styles.icon}/>
                        </TouchableHighlight>
                        <Text>
                            <Text style={styles.title}>Status{"\n"}</Text>
                            <Text style={styles.status}>
                                {status 
                                ? <Text style={styles.status_online}>   Online</Text>
                                : <Text style={styles.status_offline}>  Offline</Text>
                                }
                            </Text>
                        </Text>
                        <TouchableHighlight style={{borderRadius: 35}} onPress={() => this.openHelp(true)}>
                            <Icon name="help-circle" size={35} style={styles.icon}/>
                        </TouchableHighlight>
                    </View>
                    <View style={styles.info}>
                        <Text>
                            <Text style={styles.temperature}>Temperatura {"\n"}</Text>
                            <Text style={styles.values}>{temperature} <Text style={styles.unit}>ºC</Text></Text>
                        </Text>
                        <Text>
                            <Text style={styles.humidity}>Umidade {"\n"}</Text>
                            <Text style={styles.values}>{humidity} <Text style={styles.unit}></Text></Text>
                        </Text>
                    </View>
                </View>

                {/* Body */}
                <ScrollView>
                    <View>
                        <View>
                            <LineChart
                                data={ data_plot_temperature }
                                width={screenWidth}
                                height={450}
                                chartConfig={chartConfig}
                                bezier
                                fromZero
                                hidePointsAtIndex={[0, 1, 2, 3]}
                                style={{
                                    marginTop: 10,
                                    fontSize:5,
                                    margin: 25,
                                    marginLeft: "6%",
                                    marginVertical: 8,
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 30,
                                }}
                            />
                            <LineChart
                                data={ data_plot_humidity }
                                width={screenWidth}
                                height={450}
                                chartConfig={chartConfig}
                                hidePointsAtIndex={[0, 1, 2, 3]}
                                withShadow={false}
                                bezier
                                style={{
                                    marginTop:10,
                                    marginBottom: 10,
                                    fontSize: 5,
                                    margin: 25,
                                    marginLeft: "6%",
                                    marginVertical: 8,
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 30,
                                }}
                            />
                        </View>
                    </View>
                </ScrollView>

                {/* Tab */}
                <View>
                    <View style={styles.containerTabs}>
                        <View>
                            <Picker
                                selectedValue={this.state.pickerSelection}
                                style={{height: 50, width: screenWidth - 100, justifyContent: 'center'}}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({pickerSelection: itemValue})
                                }>
                                <Picker.Item label={database[0][1]} value="0" />
                                <Picker.Item label={database[1][1]} value="1" />
                                <Picker.Item label={database[2][1]} value="2" />
                                <Picker.Item label={database[3][1]} value="3" />
                            </Picker>
                        </View>
                    </View>
                </View>

                {/* Ajuda */}
                <Dialog
                    title="Ajuda"
                    animationType="fade"
                    contentStyle={{
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onTouchOutside={() => this.openHelp(false)}
                    visible={this.state.showHelp}
                >
                    <Text style={{ marginVertical: 30, justifyContent: 'space-evenly' }}>
                        Selecione uma planta para começar. {"\n"}
                        Ao selecionar uma planta, será indicado a temperatura ideal para a mesma. {"\n"}
                        Mais informações podem ser vistas em "Info".
                        {"\n\n"}
                        Umidade: {"\n"}
                        500 - 400 {"->"} Terra seca, necessita regar; {"\n"}
                        400 - 300 {"->"} Umidade ideal, não necessita regar; {"\n"}
                        300 - 200 {"->"} Terra muito umida, regue menos da próxima vez. {"\n"}
                    </Text>
                    <Button
                        onPress={() => this.openHelp(false)}
                        style={{ marginTop: 10 }}
                        title="Fechar"
                    />
                </Dialog>

                {/* Info */}
                <Dialog
                    title={database[parseInt(this.state.pickerSelection)][1]}
                    animationType="fade"
                    contentStyle={{
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onTouchOutside={() => this.openInfo(false)}
                    visible={this.state.showInfo}
                >
                    <Text style={{ marginVertical: 30 }}>
                        Temperatura ideal: {database[this.state.pickerSelection][2]} ºC {"\n"}
                        {"\n"}
                        Instruções para irrigação: {"\n"}
                        {database[this.state.pickerSelection][3]}
                    </Text>
                    <Button
                        onPress={() => this.openInfo(false)}
                        style={{ marginTop: 10 }}
                        title="Fechar"
                    />
                </Dialog>
            </LinearGradient>
        );
    }
}

export default App;
