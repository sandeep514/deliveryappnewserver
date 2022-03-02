import React, {useState} from 'react';
import {Input} from 'react-native-elements';

function ItemComponent({
  defaultImage = '',
  listItems = [],
  sortedItm = [],
  buyerId = '',
}) {
  const [activeIndicatorLoader, setActiveIndicatorLoader] = useState(true);
  const [sortedData, setSortedData] = useState();

  const changeText = (text, movedBuyerId) => {
    // var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    //
    // if (format.test(text) == false) {
    //   if (text != '' && text != NaN && text != undefined && text.length != 0) {
    //     if (isNaN(text) != true) {
    //       if (text > listItems.length) {
    //         alert(' Max Number will be ' + listItems.length);
    //         return false;
    //       } else {
    //         listItems.splice(listItems.indexOf(movedBuyerId), 1);
    //
    //         let checkIfAvaiable = listItems.indexOf(text);
    //         let changedOrder = text - 1;
    //         let currentReplacebalebuyerId = listItems[changedOrder];
    //         let beforeArray = [];
    //         let replacedArray = [];
    //         let afterArray = [];
    //
    //         for (let i = 0; i < listItems.length; i++) {
    //           if (i == changedOrder) {
    //             replacedArray.push(movedBuyerId);
    //             replacedArray.push(currentReplacebalebuyerId);
    //           }
    //
    //           if (i < changedOrder) {
    //             beforeArray.push(listItems[i]);
    //           }
    //           if (i > changedOrder) {
    //             afterArray.push(listItems[i]);
    //           }
    //         }
    //         const contacttwo = beforeArray.concat(replacedArray);
    //         const contactthree = contacttwo.concat(afterArray);
    //         setSortedData(contactthree);
    //         sortedItm(contactthree);
    //       }
    //     }
    //   }
    // } else {
    //   alert('Only numeric values allowed.');
    //   return false;
    // }
  };

  return (
    <Input
      allowFontScaling={false}
      onChangeText={text => {
        changeText(text, buyerId);
      }}
      keyboardType="number-pad"
      defaultValue={defaultImage}
      style={{backgroundColor: 'white', width: 60}}
    />
  );
}

export default React.memo(ItemComponent);
