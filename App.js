import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';
import{ Header, Icon, Input, Button, ListItem } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const db = SQLite.openDatabase('coursedb.db');

export default function App() {
  const [credit, setCredit] = useState('');
  const [title, setTitle] = useState('');
  const [courses, setCourses] = useState([]);
  const [item, setItem] = useState('');

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists course (id integer primary key not null, credits int, title text);');
    });
    updateList();    
  }, []);

  const saveItem = () => {
    db.transaction(tx => {
        tx.executeSql('insert into course (credits, title) values (?, ?);', [credit, title]);    
      }, null, updateList
    )
  }

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from course;', [], (_, { rows }) =>
        setCourses(rows._array)
      ); 
    });
  }

  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from course where id = ?;`, [id]);
      }, null, updateList
    )    
  }

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };

  return (
    <SafeAreaProvider>
    <View style={styles.container}>

      <Header
      leftComponent={{ icon:'menu', color: '#fff' }}
      centerComponent={{ text:'SHOPPINGLIST', style:{ color: '#fff' } }}
      rightComponent={{ icon:'home', color: '#fff' }}
      />

      <Text> </Text>
      <Text> </Text>
      <Text> </Text>

      <Input placeholder='Product' label='PRODUCT'
        onChangeText={(title) => setTitle(title)}
        value={title}/>  

      <Input placeholder='Amount' label='AMOUNT'
        onChangeText={(credit) => setCredit(credit)}
        value={credit}/>   

      <Button raised icon={{ name:'save' }} onPress={saveItem} title="SAVE" /> 

      <Text style={{marginTop: 30, fontSize: 20}}>Shopping list</Text>

      <FlatList 
        style={{marginLeft : "5%"}}
        keyExtractor={item => item.id.toString()} 
        renderItem={({item}) => <View style={styles.listcontainer}><Text style={{fontSize: 18}}>{item.title}, {item.credits}</Text>
        <Text style={{fontSize: 18, color: '#0000ff'}} onPress={() => deleteItem(item.id)}> Bought</Text></View>} 
        data={courses} 
        ItemSeparatorComponent={listSeparator} 
      />

      
    

    </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
 },
 listcontainer: {
  flexDirection: 'row',
  backgroundColor: '#fff',
  alignItems: 'center'
 },
});