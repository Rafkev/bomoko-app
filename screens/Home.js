import React, { useRef, useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Image,
    ImageBackground,
    TouchableOpacity,
    FlatList,
    Animated,
    Platform
} from 'react-native';
import { VictoryPie } from 'victory-native';

import {Svg} from 'react-native-svg';

import { COLORS, FONTS, SIZES, icons, images } from '../constants';

const income = "income";
const expense = "expense";

let categoriesData = [
    {
      id: 1,
      name: "Ventes",
      icon: icons.shopping,
      cat: income,
      color: COLORS.purple,
      data: [
        {
          id: 1,
          description: "Vente 1kg de Legumes frais",
          total: 100.00,
          date: "2023-04-10"
        },
      ],
    },
    {
      id: 2,
      name: "Remboursements",
      icon: icons.refund,
      cat: income,
      color: COLORS.blue,
      data: [
        {
          id: 1,
          description: "Frais de déplacement pour la réunion avec le client",
          total: 50.00,
          date: "2023-04-11"
        },
        {
          id: 2,
          description: "Déjeuner avec le client",
          total: 25.00,
          date: "2023-04-12"
        },
      ],
    },
    {
      id: 3,
      name: "Intérêts",
      icon: icons.interest,
      cat: income,
      color: COLORS.darkgreen,
      data: [
        {
          id: 1,
          description: "Intérêts sur les comptes d'épargne",
          total: 10.00,
          date: "2023-04-15"
        },
      ],
    },
    {
      id: 4,
      name: "Subventions",
      icon: icons.grant,
      cat: income,
      color: COLORS.red,
      data: [
        {
          id: 1,
          description: "Subvention pour le projet de recherche",
          total: 5000.00,
          date: "2023-04-20"
        },
      ],
    },
    {
      id: 5,
      name: "Investissements",
      icon: icons.investment,
      cat: income,
      color: COLORS.peach,
      data: [
        {
          id: 1,
          description: "Achat d'un immeuble à usage commercial",
          total: 100000.00,
          date: "2023-04-30"
        },
      ],
    },

    {
        id: 6,
        name: "Achat",
        icon: icons.shopping,
        cat: expense,
        color: COLORS.lightBlue,
        data: [
          {
            id: 1,
            description: "Achat 1kg de Legumes frais",
            total: 100.00,
            date: "2023-04-10"
          },
        ],
      },
      {
        id: 7,
        name: "Sortie 2",
        icon: icons.cash,
        cat: expense,
        color: COLORS.peach,
        data: [
          {
            id: 1,
            description: "Frais de déplacement pour la réunion avec le client",
            total: 50.00,
            date: "2023-04-11"
          },
          {
            id: 2,
            description: "Déjeuner avec le client",
            total: 25.00,
            date: "2023-04-12"
          },
        ],
      },
      {
        id: 8,
        name: "Sortie 3",
        icon: icons.cashbook,
        cat: expense,
        color: COLORS.darkgreen,
        data: [
          {
            id: 1,
            description: "Intérêts sur les comptes d'épargne",
            total: 10.00,
            date: "2023-04-15"
          },
        ],
      },
      {
        id: 9,
        name: "Sortie 4",
        icon: icons.sell,
        cat: expense,
        color: COLORS.red,
        data: [
          {
            id: 1,
            description: "Subvention pour le projet de recherche",
            total: 5000.00,
            date: "2023-04-20"
          },
        ],
      },
      {
        id: 10,
        name: "Sortie 5",
        icon: icons.income,
        cat: expense,
        color: COLORS.yellow,
        data: [
          {
            id: 1,
            description: "Achat d'un immeuble à usage commercial",
            total: 100000.00,
            date: "2023-04-30"
          },
        ],
      },
  ];
  
const Home = () => {

    

    const categoryListHeightAnimationValue = useRef(new Animated.Value(115)).current;

    const [categories, setCategories] = useState(categoriesData.filter((value, key)=> value.cat === "income"))
    const [ Cat, setCat ] = React.useState("income");
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [showMoreToggle, setShowMoreToggle] = useState(false)
    const [ date, setDate ] = useState(new Date());


    function renderNavBar() {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    height: 80,
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    paddingHorizontal: SIZES.padding,
                    backgroundColor: COLORS.white,
                }}
            >
                <TouchableOpacity
                    style={{ justifyContent: 'center', width: 50, }}
                    onPress={() => console.log('Menu')}
                >
                    <Image
                        source={icons.menu}
                        style={{
                            width: 25,
                            height: 25,
                            tintColor: COLORS.primary
                        }}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ justifyContent: 'center', alignItems: 'flex-end', width: 50 }}
                    onPress={() => console.log('search')}
                >
                    <Image
                        source={icons.search}
                        style={{
                            width: 30,
                            height: 30,
                            tintColor: COLORS.primary
                        }}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    function renderHeader() {
        return (
            <View style={{ paddingHorizontal: SIZES.padding, paddingVertical: SIZES.padding, backgroundColor: COLORS.white }}>
                <View>
                    <Text style={{ color: COLORS.primary, ...FONTS.h2 }}>Balance totale</Text>
                    <Text style={{ ...FONTS.h3, color: COLORS.darkgray }}>(Résumé)</Text>
                </View>

                <View style={{ flexDirection: 'row', marginTop: SIZES.padding, alignItems: 'center' }}>
                    <View style={{
                        backgroundColor: COLORS.lightGray,
                        height: 50,
                        width: 50,
                        borderRadius: 25,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Image
                            source={icons.calendar}
                            style={{
                                width: 20,
                                height: 20,
                                tintColor: COLORS.lightBlue
                            }}
                        />
                    </View>

                    <View style={{ marginLeft: SIZES.padding }}>
                        <Text style={{ color: COLORS.primary, ...FONTS.h3 }}>{date.toLocaleDateString('fr-FR')}</Text>
                        <Text style={{ ...FONTS.body3, color: COLORS.darkgray }}>18% plus que le mois passé</Text>
                    </View>
                </View>
            </View>
        )
    }

    function renderCategoryHeaderSection() {
        return (
            <View style={{ flexDirection: 'row', padding: SIZES.padding, justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Title */}
                <View>
                    <Text style={{ color: Cat == "expense" ? COLORS.secondary : COLORS.darkgreen, ...FONTS.h3 }}>{Cat == "income" ? "Crédit (Entrée)" : "Débit (Sortie)"}</Text>
                    <Text style={{ color: COLORS.darkgray, ...FONTS.body4 }}>2000 FC</Text>
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: Cat == "income" ? COLORS.darkgreen : null,
                            height: 50,
                            width: 50,
                            borderRadius: 25
                        }}
                        onPress={() => {
                            setCat("income");
                            setCategories(categoriesData.filter((value, key)=> value.cat === "income"))
                        }}

                    >
                        <Image
                            source={icons.income}
                            resizeMode="contain"
                            style={{
                                width: 20,
                                height: 20,
                                tintColor: Cat == "income" ? COLORS.white : COLORS.darkgray,
                            }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: Cat == "expense" ? COLORS.secondary : null,
                            height: 50,
                            width: 50,
                            borderRadius: 25,
                            marginLeft: SIZES.base
                        }}
                        onPress={() => {
                            setCat("expense")
                            setCategories(categoriesData.filter((value, key)=> value.cat === "expense"))
                            }
                        }
                    >
                        <Image
                            source={icons.expense}
                            resizeMode="contain"
                            style={{
                                width: 20,
                                height: 20,
                                tintColor: Cat == "expense" ? COLORS.white : COLORS.darkgray,
                            }}
                        />
                    </TouchableOpacity>
                </View>

            </View>
        )
    }

    function renderCategoryList() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                onPress={() => {
                    setSelectedCategory(item);
                    //console.log(item)
                    }}
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    margin: 5,
                    paddingVertical: SIZES.radius,
                    paddingHorizontal: SIZES.padding,
                    borderRadius: 5,
                    backgroundColor: COLORS.white,
                    ...styles.shadow
                }}
            >
                <Image
                    source={item.icon}
                    style={{
                        width: 20,
                        height: 20,
                        tintColor: item.color
                    }}
                />
                <Text style={{ marginLeft: SIZES.base, color: COLORS.primary, ...FONTS.h4 }}>{item.name}</Text>
            </TouchableOpacity>
        )

        return (
            <View style={{ paddingHorizontal: SIZES.padding - 5 }}>
                <Animated.View style={{  }}> 
                {/* height: categoryListHeightAnimationValue */}
                    <FlatList
                        data={categories}
                        renderItem={renderItem}
                        keyExtractor={item => `${item.id}`}
                        numColumns={2}
                    />
                </Animated.View>

                {/* <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        marginVertical: SIZES.base,
                        justifyContent: 'center'
                    }}
                    onPress={() => {
                        if (showMoreToggle) {
                            Animated.timing(categoryListHeightAnimationValue, {
                                toValue: 115,
                                duration: 500,
                                useNativeDriver: false
                            }).start()
                        } else {
                            Animated.timing(categoryListHeightAnimationValue, {
                                toValue: 172.5,
                                duration: 500,
                                useNativeDriver: false
                            }).start()
                        }

                        setShowMoreToggle(!showMoreToggle)
                    }}
                >
                    <Text style={{ ...FONTS.body4 }}>{showMoreToggle ? "MOINS" : "PLUS"}</Text>
                    <Image
                        source={showMoreToggle ? icons.up_arrow : icons.down_arrow}
                        style={{ marginLeft: 5, width: 15, height: 15, alignSelf: 'center' }}
                    />
                </TouchableOpacity> */}
            </View>
        )
    }

    function renderIncomingExpensesTitle() {
        return (
            <View style={{ height: 80, backgroundColor: COLORS.lightGray2, padding: SIZES.padding }}>
                {/* Title */}
                <Text style={{ ...FONTS.h3, color: COLORS.primary }}> {Cat === "income"? "MES ENTREES" : "MES SORTIES"} </Text>
                <Text style={{ ...FONTS.body4, color: COLORS.darkgray }}>Nombre totale : {selectedCategory.data.length} </Text>
            </View>
        )
    }

    function renderIncomingExpenses() {
        let allExpenses = selectedCategory ? selectedCategory.data : [];
        console.log("allExpenses ---->", allExpenses);
        let incomingExpenses = allExpenses; //.filter(a => a.cat == "income")

        const renderItem = (item, index ) => (
            <View style={{
                marginRight: SIZES.padding,
                marginLeft: SIZES.padding,
                marginVertical: SIZES.radius,
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.white,
                ...styles.shadow
            }}>
                {/* Title */}
                <View style={{ flexDirection: 'row', padding: SIZES.padding, alignItems: 'center',  justifyContent: 'space-between', }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>   
                        <View
                            style={{
                                height: 50,
                                width: 50,
                                borderRadius: 25,
                                backgroundColor: COLORS.lightGray,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: SIZES.base
                            }}
                        >
                            <Image
                                source={selectedCategory.icon}
                                style={{
                                    width: 30,
                                    height: 30,
                                    tintColor: selectedCategory.color
                                }}
                            />
                        </View>
                        <View>
                            <Text style={{ ...FONTS.h3, color: selectedCategory.color, }}>{selectedCategory.name}</Text>
                            <Text style={{ ...FONTS.body5, flexWrap: 'wrap', color: COLORS.darkgray }}>
                                {item.description}
                            </Text>
                        </View>
                        
                        
                    </View> 

                   <View style={{  alignItems:"flex-end"}} >
                        <Text style={{ ...FONTS.h5, color: COLORS.red, }}> +{item.total.toFixed(2)} FC </Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Image
                                source={icons.calendar}
                                style={{
                                    width: 12,
                                    height: 12,
                                    tintColor: COLORS.darkgray,
                                    marginRight: 7,
                                    marginTop: 3
                                }}
                            />
                            <Text style={{ marginBottom: SIZES.base, color: COLORS.darkgray, ...FONTS.body5 }}>{item.date}</Text>
                        </View>
                   </View>
                </View>

            </View>
        )

        return (
            <View>
              {renderIncomingExpensesTitle()}  

                {
                    incomingExpenses.length > 0 &&
                    <View>
                        {
                            incomingExpenses.map((value, key) => {
                                return renderItem(value, key)
                            })
                        }
                    </View>

                }

                {
                    incomingExpenses.length == 0 &&
                    <View style={{ alignItems: 'center', justifyContent: 'center', height: 300 }}>
                        <Text style={{ color: COLORS.primary, ...FONTS.h3 }}>Aucune sortie trouvee</Text>
                    </View>
                }

            </View>

        )
    }

    function processCategoryDataToDisplay() {
        // Filter expenses with "Confirmed" status
        let chartData = categories.map((item) => {
            //console.log("item ===>", item);
            console.log(" -----> ");
            let confirmExpenses = item.data //.filter(a => a.cat == "expense")
            var total = confirmExpenses.reduce((a, b) => a + (b.total || 0), 0)

            return {
                name: item.name,
                y: total,
                expenseCount: confirmExpenses.length,
                color: item.color,
                id: item.id
            }
        })

        // filter out categories with no data/expenses
        let filterChartData = chartData.filter(a => a.y > 0)

        // Calculate the total expenses
        let totalExpense = filterChartData.reduce((a, b) => a + (b.y || 0), 0)

        // Calculate percentage and repopulate income data
        let finalChartData = filterChartData.map((item) => {
            let percentage = (item.y / totalExpense * 100).toFixed(0)
            return {
                label: `${percentage}%`,
                y: Number(item.y),
                expenseCount: item.expenseCount,
                color: item.color,
                name: item.name,
                id: item.id
            }
        })

        return finalChartData
    }

    function setSelectCategoryByName(name) {
        let category = categories.filter(a => a.name == name)
        setSelectedCategory(category[0])
    }

    function renderChart() {

        let chartData = processCategoryDataToDisplay()
        let colorScales = chartData.map((item) => item.color)
        let totalExpenseCount = chartData.reduce((a, b) => a + (b.expenseCount || 0), 0)

        console.log("Check Chart")
        //console.log(chartData)

        if(Platform.OS == 'ios')
        {
            return (
                <View  style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <VictoryPie
                        
                        data={chartData}
                        labels={(datum) => `${datum.y}`}
                        radius={({ datum }) => (selectedCategory && selectedCategory.name == datum.name) ? SIZES.width * 0.4 : SIZES.width * 0.4 - 10}
                        innerRadius={70}
                        labelRadius={({ innerRadius }) => (SIZES.width * 0.4 + innerRadius) / 2.5}
                        style={{
                            labels: { fill: "white",  },
                            parent: {
                                ...styles.shadow
                            },
                        }}
                        width={SIZES.width * 0.8}
                        height={SIZES.width * 0.8}
                        colorScale={colorScales}
                        events={[{
                            target: "data",
                            eventHandlers: {
                                onPress: () => {
                                    return [{
                                        target: "labels",
                                        mutation: (props) => {
                                            let categoryName = chartData[props.index].name
                                            setSelectCategoryByName(categoryName)
                                        }
                                    }]
                                }
                            }
                        }]}
    
                    />
    
                    <View style={{ position: 'absolute', top: '42%', left: "42%" }}>
                        <Text style={{ ...FONTS.h1, textAlign: 'center' }}>{totalExpenseCount}</Text>
                        <Text style={{ ...FONTS.body3, textAlign: 'center' }}>Expenses</Text>
                    </View>
                </View>
    
            )
        }
        else
        {
            // Android workaround by wrapping VictoryPie with SVG
            return (
                <View  style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Svg width={SIZES.width} height={SIZES.width} style={{width: "100%", height: "auto"}}>

                        <VictoryPie
                            standalone={false} // Android workaround
                            data={chartData}
                            labels={(datum) => `${datum.y}`}
                            radius={({ datum }) => (selectedCategory && selectedCategory.name == datum.name) ? SIZES.width * 0.4 : SIZES.width * 0.4 - 10}
                            innerRadius={70}
                            labelRadius={({ innerRadius }) => (SIZES.width * 0.4 + innerRadius) / 2.5}
                            style={{
                                labels: { fill: "white" },
                                parent: {
                                    ...styles.shadow
                                },
                            }}
                            width={SIZES.width}
                            height={SIZES.width}
                            colorScale={colorScales}
                            events={[{
                                target: "data",
                                eventHandlers: {
                                    onPress: () => {
                                        return [{
                                            target: "labels",
                                            mutation: (props) => {
                                                let categoryName = chartData[props.index].name
                                                setSelectCategoryByName(categoryName)
                                            }
                                        }]
                                    }
                                }
                            }]}
        
                        />
                    </Svg>
                    <View style={{ position: 'absolute', top: '42%', left: "42%" }}>
                        <Text style={{ ...FONTS.h1, textAlign: 'center' }}>{totalExpenseCount}</Text>
                        <Text style={{ ...FONTS.body3, textAlign: 'center' }}>Expenses</Text>
                    </View>
                </View>
            )
        }
        
    }

    function renderExpenseSummary() {
        let data = processCategoryDataToDisplay()

        const renderItem = ({ item }) => (
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    height: 40,
                    paddingHorizontal: SIZES.radius,
                    borderRadius: 10,
                    backgroundColor: (selectedCategory && selectedCategory.name == item.name) ? item.color : COLORS.white
                }}
                onPress={() => {
                    let categoryName = item.name
                    setSelectCategoryByName(categoryName)
                }}
            >
                {/* Name/Category */}
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <View
                        style={{
                            width: 20,
                            height: 20,
                            backgroundColor: (selectedCategory && selectedCategory.name == item.name) ? COLORS.white : item.color,
                            borderRadius: 5
                        }}
                    />

                    <Text style={{ marginLeft: SIZES.base, color: (selectedCategory && selectedCategory.name == item.name) ? COLORS.white : COLORS.primary, ...FONTS.h3 }}>{item.name}</Text>
                </View>

                {/* Expenses */}
                <View style={{ justifyContent: 'center' }}>
                    <Text style={{ color: (selectedCategory && selectedCategory.name == item.name) ? COLORS.white : COLORS.primary, ...FONTS.h3 }}>{item.y} USD - {item.label}</Text>
                </View>
            </TouchableOpacity>
        )

        return (
            <View style={{ padding: SIZES.padding }}>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => `${item.id}`}
                />
            </View>

        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.lightGray2 }}>
            {/* Nav bar section */}
            {renderNavBar()}

            {/* Header section */}
            {renderHeader()}

            {/* Category Header Section */}
            {renderCategoryHeaderSection()}

            <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
            <View>
                {renderCategoryList()}
                {renderIncomingExpenses()}

                {/* {renderChart()} */}
                {/* {renderExpenseSummary()} */}
            </View>
                
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
    }
})

export default Home;
