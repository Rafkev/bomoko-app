import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Animated,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Divider, FAB, IconButton, TextInput } from 'react-native-paper';

import { COLORS, FONTS, SIZES, icons, images } from '../constants';

import { VictoryPie } from 'victory-native';
import { Svg } from 'react-native-svg';
import { Button} from 'react-native-paper';
import { loadCategoriesFromStorage, resetAllCat } from '../redux/catReducer';
import { addDays } from 'date-fns';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Block, Text } from '../components';


const Home = ({ navigation }) => {
  const catList = useSelector((state) => state.categories.categories);
  //console.log('catList', catList);
  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();

  const [Cat, setCat] = useState('income');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [visible, setVisible] = useState(false);

  const [state, setState] = useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;

  const snapPoints = useMemo(() => ["50%", '70%', '80%', '90%'], []);
  const [openDebit, setOpenDebit] = useState(false);
  const [openCredit, setOpenCredit] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);

  const [selectedValue, setSelectedValue] = useState('');
  const [total, setTotal] = useState('');
  const [description, setDescription] = useState('');

  const bottomSheetDebit = useRef(null);
  const bottomSheetCredit = useRef(null);
  const bottomSheetDetails = useRef(null);

  const BackdropElement = useCallback(
    (backdropProps) => (
      <BottomSheetBackdrop
        {...backdropProps}
        opacity={0.7}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  const openModalDebit = useCallback(() => {
    bottomSheetDebit.current?.present();
    setTimeout(() => {
      setOpenDebit(true);
    }, 5);
  }, []);

  const openModalCredit = useCallback(() => {
    bottomSheetCredit.current?.present();
    setTimeout(() => {
      setOpenCredit(true);
    }, 5);
  }, []);

  const openModalDetails = useCallback(() => {
    bottomSheetDetails.current?.present();
    setTimeout(() => {
      setOpenDetails(true);
    }, 5);
  }, []);

  const handleClosePressDisplayDetail = useCallback(() => {
    bottomSheetDetails.current?.close();
  }, []);

  const hideModalDisplayDetail = () => handleClosePressDisplayDetail();



  // const renderBottomDebit = () => (
  //   <BottomSheetModal
  //     ref={bottomSheetDebit}
  //     index={1}
  //     backdropComponent={BackdropElement}
  //     snapPoints={snapPoints}
  //     onDismiss={() => setOpenDebit(false)}
  //   >
  //     <BottomSheetScrollView style={{ padding: 17 }}>
  //       <Block row space='between' >
  //         <Text>dEBITS</Text>
  //       </Block>
  //     </BottomSheetScrollView>
  //   </BottomSheetModal>
  // );

  // const renderBottomCredit = () => (
  //   <BottomSheetModal
  //     // style={{ zIndex: 19 }}
  //     ref={bottomSheetCredit}
  //     index={1}
  //     backdropComponent={BackdropElement}
  //     snapPoints={snapPoints}
  //     onDismiss={() => setOpenCredit(false)}
  //   >
  //     <BottomSheetScrollView style={{ padding: 17 }}>
  //       <Block row space='between' >
  //         <Text>CREDIT</Text>
  //       </Block>
  //       {
  //         addIncome()
  //       }
  //     </BottomSheetScrollView>
  //   </BottomSheetModal>
  // );

  const renderBottomDetails = () => (
    
    <BottomSheetModal
      ref={bottomSheetDetails}
      index={0}
      backdropComponent={BackdropElement}
      snapPoints={snapPoints}
      onDismiss={() => setOpenDetails(false)}
    >
      <BottomSheetScrollView style={{ padding: 17 }}>

        <Block p={17} >
          <Block row space='between'>
            <Block m_b={10} flex={1}>
              <Text bold h2>Details</Text>
              <Text color={COLORS.blue}>{`Details de l'opération.`}</Text>
            </Block>
            <TouchableOpacity
              onPress={() => hideModalDisplayDetail()}
            >
              <IconButton
                icon="close"
                iconColor={COLORS.red}
                size={40}
              />
            </TouchableOpacity>

          </Block>
 
          <Block style={{ padding: 5 }} row space='between'>
            <Block flex={1}>
              <Image
                source={selectedItem && selectedItem.icon}
                style={{
                  width: 50,
                  height: 50,
                  tintColor: selectedItem && selectedItem.color,
                  borderRadius: 25, borderWidth: 1,
                  borderColor: selectedItem && selectedItem.color,
                  borderWidth: 1,
                  padding: 5
                }}
              />
            </Block>

            <Block flex={4} middle>
              <Block row space='between'>
                <Text bold>DATE :</Text>
                <Text gray>{selectedItem && selectedItem.date}</Text>
              </Block>

              <Block row space='between'>
                <Text bold>TYPE :</Text>
                <Text gray>{selectedItem &&  selectedItem.name}</Text>
              </Block>


            </Block>

          </Block>

          <Divider />
          <Block style={{ marginVertical: 8 }} row space='between'>
            <Text h3 bold>DESCRIPTION</Text>
            <Text >{selectedItem && selectedItem.description}
            </Text>
          </Block>

          <Divider />
          <Block style={{ marginVertical: 8 }} row space='between'>
            <Text h3 bold>SOMME</Text>
            <Text>{selectedItem && selectedItem.total} USD</Text>
          </Block>

          <Divider />
          <Block row space="between" style={{ marginVertical: 8 }} >
            <Button mode='outlined'>Modifier</Button>
            <Button mode='contained' buttonColor={COLORS.peach} >Supprimer </Button>
          </Block> 

        </Block>

      </BottomSheetScrollView>
    </BottomSheetModal>
  );

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {
    backgroundColor: 'white',
    //padding: 20,
    width: '85%',
    borderRadius: 10,
    alignSelf: 'center',
  };

  // SELECTED ITEM
  const [selectedItem, setSelectedItem] = useState();

  useEffect(() => {
    // updatedAsyncStorage();

    setCategories(catList.filter((value, key) => value.cat === 'income'));
    setCat('income');
  }, [catList]);
  const [date, setDate] = useState(new Date());

  const updatedAsyncStorage = async () => {
    dispatch(loadCategoriesFromStorage());
    console.log('test1', catList);
    console.log('test', [].length);
  };

  function renderNavBar() {
    return (
      <View
        style={{
          flexDirection: 'row',
          paddingTop: SIZES.base * 5,
          justifyContent: 'space-between',
          //alignItems: 'flex-end',
          paddingHorizontal: SIZES.padding,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
          }}
        >
          <TouchableOpacity
            style={{
              //width: 80,
              //justifyContent: 'center',
              //backgroundColor: COLORS.white,
              //borderRadius: 30,
              paddingRight: SIZES.base * 2,
            }}
            onPress={() => {
              console.log('Menu');
              //navigation.navigate(AuthScreen);
              navigation.openDrawer();
            }}
          >
            <Image
              source={icons.menu}
              style={{
                width: SIZES.base * 4,
                height: SIZES.base * 3,
                tintColor: COLORS.white,
              }}
            />
          </TouchableOpacity>

          <Text style={{ color: COLORS.white, ...FONTS.h2 }}>Afintech</Text>
        </View>

        <TouchableOpacity
          style={{ justifyContent: 'center', alignItems: 'flex-end', width: 50 }}
          onPress={() => console.log('search')}
        >
          <Image
            source={icons.search}
            style={{
              width: 30,
              height: 30,
              tintColor: COLORS.white,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function renderHeader() {
    return (
      <View
        style={{
          zIndex: 10,
          paddingHorizontal: SIZES.padding,
          paddingVertical: SIZES.padding / 2,
          borderBottomColor: COLORS.gray,
          borderBottomWidth: 1,
        }}
      >
        <View style={{}}>
          <Text style={{ ...FONTS.h3, color: COLORS.gray }}>(Portefeuil electronique)</Text>
        </View>

        <View style={{}}>

          <Text style={{
            ...FONTS.h1, color: COLORS.black, textAlign: 'center',
            fontWeight: 'bold', marginTop: 10
          }}> {totalSumDC()} USD </Text>
        </View>

        <View style={styles.date}>
          <TouchableOpacity
            onPress={() => {
              setDate(addDays(date, -1))
            }}>
            <IconButton
              icon="arrow-left-circle"
              iconColor={COLORS.white}
              size={20}
            />
          </TouchableOpacity>

          <TouchableOpacity style={{ flexDirection: 'row' }}>
            <Text style={{ paddingTop: 10 }}>{date.toLocaleDateString('fr-FR')}</Text>
            <IconButton
              icon="arrow-down"
              iconColor={COLORS.black}
              size={12}
              style={{ marginLeft: -5 }}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            setDate(addDays(date, 1))
          }}>
            <IconButton
              icon="arrow-right-circle"
              iconColor={COLORS.white}
              size={20}
            />
          </TouchableOpacity>

        </View>


        <View
          style={{
            margin: SIZES.padding,
            // zIndex: 10,
            position: 'absolute',
            top: SIZES.padding * 4.2,
            width: '100%',
            backgroundColor: '#eef2f7', //   lightGray: ,

            //paddingTop: SIZES.padding,
            borderRadius: SIZES.radius,
            ...styles.shadow,
          }}
        >
          <View style={{ display: 'flex', flexDirection: 'row', width: '49%', padding: '1%', justifyContent: 'space-between' }}>
            {renderIncomingExpensesTitle('income')}
            {renderIncomingExpensesTitle('expense')}
          </View>

        </View>


      </View>
      // </>
    );
  }

  function renderCategoryHeaderSection() {
    return (
      <View
        style={{
          //padding: SIZES.padding,
          paddingTop: SIZES.padding * 2.5,
        }}
      >
      </View>
    );
  }

  // function renderCategoryList() {
  //   const renderItem = ({ item }) => (
  //     <TouchableOpacity
  //       onPress={() => {
  //         setSelectedCategory(item);
  //         //console.log(item)
  //       }}
  //       style={{
  //         flex: 1,
  //         flexDirection: 'row',
  //         margin: 5,
  //         paddingVertical: SIZES.radius,
  //         paddingHorizontal: SIZES.padding,
  //         borderRadius: 5,
  //         backgroundColor: COLORS.white,
  //         ...styles.shadow,
  //       }}
  //     >
  //       <Image
  //         source={item.icon}
  //         style={{
  //           width: 20,
  //           height: 20,
  //           tintColor: item.color,
  //         }}
  //       />
  //       <Text style={{ marginLeft: SIZES.base, color: COLORS.primary, ...FONTS.h4 }}>
  //         {item.name}
  //       </Text>
  //     </TouchableOpacity>
  //   );

  //   return (
  //     <View style={{ paddingHorizontal: SIZES.padding - 5 }}>
  //       <Animated.View style={{}}>
  //         <FlatList
  //           data={categories}
  //           renderItem={renderItem}
  //           keyExtractor={(item) => `${item.id}`}
  //           numColumns={2}
  //         />
  //       </Animated.View>
  //     </View>
  //   );
  // }

  function renderIncomingExpensesTitle(myCat) {
    return (
      <TouchableOpacity
        style={{
          borderRadius: 8,
          height: 80,
          backgroundColor: myCat === Cat ? COLORS.white : 'transparent',
          padding: SIZES.padding,
          // elevation: 0,
          width: '100%',
          margin: '2%'
        }}
        onPress={() => {
          setCat(myCat);
          setCategories(catList.filter((value, key) => value.cat === myCat));
          setSelectedCategory(null);
        }}
      >
        {/* Title */}
        <Text style={{ ...FONTS.h3, color: COLORS.primary }}>
          {' '}
          {myCat === 'income' ? 'ENTREES' : 'SORTIES'}{' '}
        </Text>

        <Text style={{ ...FONTS.h4, color: myCat === 'income' ? COLORS.darkgreen : COLORS.red }}>
          {totalSumDCHome(myCat).toFixed(2) && totalSumDCHome(myCat).toFixed(2)} USD
        </Text>
      </TouchableOpacity>
    );
  }

  function renderIncomingExpenses() {
    let allExpensesCat = selectedCategory ? selectedCategory.data : [];

    let incomingExpenses = allExpensesCat;

    const renderItem = (item) => (
      <TouchableOpacity
        onPress={() => {
          //console.log('------------------',item);
          setSelectedItem(selectedItem);
          console.log('------------------',selectedItem);

          // showModal(true);
          openModalDetails();
        }}
      >
        <View
          style={{
            marginRight: SIZES.padding,
            marginLeft: SIZES.padding,
            marginVertical: SIZES.padding / 3.7,
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.white,
            ...styles.shadow,
          }}
        >
          {/* Title */}
          <View
            style={{
              flexDirection: 'row',
              padding: SIZES.padding / 2,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{
                width: '60%',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 25,
                  backgroundColor: COLORS.lightGray,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: SIZES.base,
                }}
              >
                <Image
                  source={selectedCategory.icon}
                  style={{
                    width: 30,
                    height: 30,
                    tintColor: selectedCategory.color,
                  }}
                />
              </View>
              <View>
                <Text style={{ ...FONTS.h3, color: selectedCategory.color }}>
                  {selectedCategory && selectedCategory.name}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    overflow: 'hidden',
                    ...FONTS.body5,
                    flexWrap: 'wrap',
                    color: COLORS.darkgray,
                  }}
                >
                  {item.description}
                </Text>
              </View>
            </View>

            <View style={{ width: '25%', alignItems: 'flex-end' }}>
              <Text style={{ ...FONTS.h5, color: COLORS.red }}>
                {' '}
                {Cat === 'income' ? '+' : '-'} {item.total.toFixed(2)} USD{' '}
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <Image
                  source={icons.calendar}
                  style={{
                    width: 12,
                    height: 12,
                    tintColor: COLORS.darkgray,
                    marginRight: 7,
                    marginTop: 3,
                  }}
                />
                <Text style={{ marginBottom: SIZES.base, color: COLORS.darkgray, ...FONTS.body5 }}>
                  {item.date}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );

    return (
      <View>

        {incomingExpenses.length > 0 && (
          <View>
            {incomingExpenses.map((value, key) => {
              return renderItem(value, key);
            })}
          </View>
        )}

        {incomingExpenses.length == 0 && renderAllIncomingExpenses()}
      </View>
    );
  }

  function renderAllIncomingExpenses() {
    var fin = [];
    let category = categories.map((v, k) => {
      var el = v.data.map((vv, kk) => {
        return { ...vv, cat: v.cat, color: v.color, icon: v.icon, id: 1, name: v.name };
      });
      fin.push(...el);
      return el[0];
    });

    let incomingExpenses = fin;

    const renderItem = (item, cat) => (
      <TouchableOpacity
        onPress={() => {
          console.log(item);
          setSelectedItem(item);
          // showModal(true);
          openModalDetails()
        }}
      >
        <View
          style={{
            marginRight: SIZES.padding,
            marginLeft: SIZES.padding,
            marginVertical: SIZES.padding / 3.7,
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.white,
            ...styles.shadow,
          }}
        >
          {/* Title */}
          <View
            style={{
              flexDirection: 'row',
              padding: SIZES.padding / 2,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{
                width: '60%',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 25,
                  backgroundColor: COLORS.lightGray,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: SIZES.base,
                }}
              >
                <Image
                  source={item.icon}
                  style={{
                    width: 30,
                    height: 30,
                    tintColor: item.color,
                  }}
                />
              </View>
              <View>
                <Text numberOfLines={1} style={{ ...FONTS.h3, color: item.color }}>{item && item.name}</Text>
                <Text
                  numberOfLines={1}
                  style={{
                    overflow: 'hidden',
                    ...FONTS.body5,
                    flexWrap: 'wrap',
                    color: COLORS.darkgray,
                  }}
                >
                  {item.description}
                </Text>
              </View>
            </View>

            <View style={{ width: '25%', alignItems: 'flex-end' }}>
              <Text style={{ ...FONTS.h5, color: COLORS.red }}>
                {' '}
                {Cat === 'income' ? '+' : '-'} {item.total.toFixed(2)} USD{' '}
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <Image
                  source={icons.calendar}
                  style={{
                    width: 12,
                    height: 12,
                    tintColor: COLORS.darkgray,
                    marginRight: 7,
                    marginTop: 3,
                  }}
                />
                <Text style={{ marginBottom: SIZES.base, color: COLORS.darkgray, ...FONTS.body5 }}>
                  {item.date}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );

    return (
      <View>

        {incomingExpenses.length > 0 && (
          <View>
            {incomingExpenses.map((value, key) => {
              return renderItem(value, key);
            })}
          </View>
        )}

        {incomingExpenses.length == 0 && (
          <View style={{ alignItems: 'center', justifyContent: 'center', height: 300 }}>
            <Text style={{ color: COLORS.primary, ...FONTS.h3 }}>
              Aucune {Cat == 'expense' ? 'sortie' : 'entrée'} trouvée
            </Text>
          </View>
        )}
      </View>
    );
  }

  const totalSum = () => {
    var tot = 0;
    categories.map((item) => {
      let confirm = item.data; //.filter(a => a.cat == "expense")
      var total = parseFloat(
        confirm.reduce((a, b) => parseFloat(a) + (parseFloat(b.total) || 0), 0)
      );
      tot += total;
      return total;
    });
    // console.log(tot);
    return tot;
  };

  const totalSumDC = () => {
    var totExpense = 0;
    var totIncome = 0;
    catList
      .filter((a) => a.cat == 'expense')
      .map((item) => {
        let confirm = item.data; //.filter(a => a.cat == "expense")
        var total = parseFloat(
          confirm.reduce((a, b) => parseFloat(a) + (parseFloat(b.total) || 0), 0)
        );
        totExpense += total;
        return total;
      });

    catList
      .filter((a) => a.cat == 'income')
      .map((item) => {
        let confirmI = item.data;
        var totalI = parseFloat(
          confirmI.reduce((a, b) => parseFloat(a) + (parseFloat(b.total) || 0), 0)
        );
        totIncome += totalI;
        return totalI;
      });

    return totIncome - totExpense;
  };

  const totalSumDCHome = (myCat) => {
    // console.log(myCat);
    var tot = 0;
    catList
      .filter((a) => a.cat == myCat)
      .map((item) => {
        let confirm = item.data;
        var total = parseFloat(
          confirm.reduce((a, b) => parseFloat(a) + (parseFloat(b.total) || 0), 0)
        );
        tot += total;
        return total;
      });
    // console.log('tot', tot);
    return tot;
  };

  function processCategoryDataToDisplay() {
    // Filter expenses with "Confirmed" status
    let chartData = categories.map((item) => {
      let confirmExpenses = item.data; //.filter(a => a.cat == "expense")
      var total = confirmExpenses.reduce((a, b) => a + (b.total || 0), 0);

      return {
        name: item.name,
        y: total,
        expenseCount: confirmExpenses.length,
        color: item.color,
        id: item.id,
      };
    });

    // filter out categories with no data/expenses
    let filterChartData = chartData.filter((a) => a.y > 0);

    // Calculate the total expenses
    let totalExpense = filterChartData.reduce((a, b) => a + (b.y || 0), 0);

    // Calculate percentage and repopulate income data
    let finalChartData = filterChartData.map((item) => {
      let percentage = ((item.y / totalExpense) * 100).toFixed(0);
      return {
        label: `${percentage}%`,
        y: Number(item.y),
        expenseCount: item.expenseCount,
        color: item.color,
        name: item.name,
        id: item.id,
      };
    });

    return finalChartData;
  }

  function setSelectCategoryByName(name) {
    let category = categories.filter((a) => a.name == name);
    setSelectedCategory(category[0]);
  }

  function renderChart() {
    let chartData = processCategoryDataToDisplay();
    let colorScales = chartData.map((item) => item.color);
    let totalExpenseCount = chartData.reduce((a, b) => a + (b.expenseCount || 0), 0);

    // console.log('Check Chart');
    // console.log(chartData)

    if (Platform.OS == 'ios') {
      return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          {/* <VictoryPie
                        
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
    
                    /> */}

          <View style={{ position: 'absolute', top: '42%', left: '42%' }}>
            <Text style={{ ...FONTS.h1, textAlign: 'center' }}>{totalExpenseCount}</Text>
            <Text style={{ ...FONTS.body3, textAlign: 'center' }}>Credits</Text>
          </View>
        </View>
      );
    } else {
      // Android workaround by wrapping VictoryPie with SVG
      return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Svg width={SIZES.width} height={SIZES.width} style={{ width: '100%', height: 'auto' }}>
            <VictoryPie
              standalone={false} // Android workaround
              data={chartData}
              labels={(datum) => `${datum.y}`}
              radius={({ datum }) =>
                selectedCategory && selectedCategory.name == datum.name
                  ? SIZES.width * 0.4
                  : SIZES.width * 0.4 - 10
              }
              innerRadius={70}
              labelRadius={({ innerRadius }) => (SIZES.width * 0.4 + innerRadius) / 2.5}
              style={{
                labels: { fill: 'white' },
                parent: {
                  ...styles.shadow,
                },
              }}
              width={SIZES.width}
              height={SIZES.width}
              colorScale={colorScales}
              events={[
                {
                  target: 'data',
                  eventHandlers: {
                    onPress: () => {
                      return [
                        {
                          target: 'labels',
                          mutation: (props) => {
                            let categoryName = chartData[props.index].name;
                            setSelectCategoryByName(categoryName);
                          },
                        },
                      ];
                    },
                  },
                },
              ]}
            />
          </Svg>
          <View style={{ position: 'absolute', top: '42%', left: '43.5%' }}>
            <Text style={{ ...FONTS.h1, textAlign: 'center' }}>{totalExpenseCount}</Text>
            <Text style={{ ...FONTS.body2, textAlign: 'center' }}>
              {Cat == 'income' ? 'Crédits' : 'Débits'}
            </Text>
          </View>
        </View>
      );
    }
  }

  function renderExpenseSummary() {
    let data = processCategoryDataToDisplay();

    const renderItem = ({ item }) => (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          height: 40,
          paddingHorizontal: SIZES.radius,
          borderRadius: 10,
          backgroundColor:
            selectedCategory && selectedCategory.name == item.name ? item.color : COLORS.white,
        }}
        onPress={() => {
          let categoryName = item.name;
          setSelectCategoryByName(categoryName);
          console.log('*****************',item);
        }}
      >
        {/* Name/Category */}
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 20,
              height: 20,
              backgroundColor:
                selectedCategory && selectedCategory.name == item.name ? COLORS.white : item.color,
              borderRadius: 5,
            }}
          />

          <Text
            style={{
              marginLeft: SIZES.base,
              color:
                selectedCategory && selectedCategory.name == item.name
                  ? COLORS.white
                  : COLORS.primary,
              ...FONTS.h3,
            }}
          >
            {item.name} 
          </Text>
        </View>

        {/* Expenses */}
        <View style={{ justifyContent: 'center' }}>
          <Text
            style={{
              color:
                selectedCategory && selectedCategory.name == item.name
                  ? COLORS.white
                  : COLORS.primary,
              ...FONTS.h3,
            }}
          >
            {item.y} USD - {item.label}
          </Text>
        </View>
      </TouchableOpacity>
    );

    return (
      <View style={{ padding: SIZES.padding }}>
        <FlatList data={data} renderItem={renderItem} keyExtractor={(item) => `${item.id}`} />
      </View>
    );
  }


  return (
    <BottomSheetModalProvider>
      <ImageBackground
        style={{
          flex: 1, position: 'absolute',
          height: '100%', width: '100%'
        }}
        source={require('./../assets/login1_bg.png')}
        blurRadius={10}
      ></ImageBackground>
      <View style={{ flex: 1 }}>
        {/* Nav bar section */}
        {renderNavBar()}

        {/* Header section */}


        <ScrollView
          contentContainerStyle={{
            // paddingBottom: 60,
            //backgroundColor: COLORS.lightGray2,
            // zIndex: 100,
          }}
        >
          {renderHeader()}
          <View style={{ backgroundColor: COLORS.lightGray2, }}>
            {/* Category Header Section */}
            {renderCategoryHeaderSection()}

            {renderExpenseSummary()}

            {/* {renderCategoryList()} */}
            {renderIncomingExpenses()}

            {renderChart()}
          </View>
        </ScrollView>
      </View>

      

      <FAB.Group
        open={open}
        visible
        variant="tertiary"
        icon={open ? 'close' : 'plus'}
        actions={[
          {
            icon: 'plus-circle',
            label: 'Crédit (Entrée)',
            //onPress: () => openModalCredit(),
            onPress: () => navigation.navigate('Income', { cat: catList }),
          },
          {
            icon: 'minus-circle',
            label: 'Débit (Sortie)',
            // onPress: () => openModalDebit(),
            onPress: () => navigation.navigate('Expense', { cat: catList }),
          },
        ]}
        onStateChange={onStateChange}
        onPress={() => {
          if (open) {
            // do something if the speed dial is open
            console.log('catList', catList);
          }
        }}
      />
      {/* {
        renderBottomCredit()
      }
      {
        renderBottomDebit()
      } */}
      {
        renderBottomDetails()
      }
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  date: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dropdownContainer: {
    borderWidth: 1.4,
    borderColor: '#aaa',
    borderRadius: 4,
    backgroundColor: '#fff',
  },

});

export default Home;
