import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
export const colors = { canvas:'#EDF2F5', surface:'#FFFFFF', ink:'#182F43', muted:'#536878', line:'#D5DFE5', accent:'#DDF273', selected:'#E7EECF', disabled:'#DDE4E8' };
export function Label({children, style, ...props}) { return <Text {...props} style={[s.label,style]}>{children}</Text>; }
export function Button({title,onPress,secondary=false,disabled=false}) { return <Pressable accessibilityRole="button" accessibilityState={{disabled}} disabled={disabled} onPress={onPress} style={({pressed})=>[s.button,secondary&&s.secondary,disabled&&s.disabled,pressed&&s.pressed]}><Text style={s.buttonText}>{title}</Text></Pressable>; }
export function BagMark() { return <View accessible={false} style={s.bag}><View style={s.handle}/><View style={s.pocket}/></View>; }
export function CheckRow({label,checked,onPress,readOnly=false}) {
  if (readOnly) {
    return <View accessible accessibilityRole="text" accessibilityLabel={`${label}, packed`} style={[s.row, s.summaryRow]}><Text style={s.summaryMark}>Packed</Text><Text style={s.item}>{label}</Text></View>;
  }
  return <Pressable accessibilityRole="checkbox" accessibilityLabel={label} accessibilityState={{checked}} accessibilityHint={checked?'Tap to unpack this item':'Tap when packed'} onPress={onPress} style={({pressed})=>[s.row,checked&&s.packedRow,pressed&&s.pressed]}><View style={[s.check,checked&&s.checked]}><Text style={s.checkmark}>{checked?'✓':''}</Text></View><Text style={s.item}>{label}</Text></Pressable>;
}
export const s = StyleSheet.create({
 label:{fontSize:12,fontWeight:'700',letterSpacing:1.2,color:colors.muted},
 button:{minHeight:56,backgroundColor:colors.accent,borderRadius:16,padding:16,justifyContent:'center',alignItems:'center'}, secondary:{backgroundColor:colors.surface,borderWidth:1,borderColor:colors.line},disabled:{backgroundColor:colors.disabled},buttonText:{fontSize:17,fontWeight:'700',color:colors.ink},pressed:{opacity:0.65},
 bag:{width:30,height:32,borderWidth:2,borderColor:colors.ink,borderRadius:8,marginTop:5},handle:{position:'absolute',top:-7,left:7,width:12,height:8,borderWidth:2,borderColor:colors.ink,borderBottomWidth:0,borderTopLeftRadius:5,borderTopRightRadius:5},pocket:{position:'absolute',bottom:4,left:5,right:5,height:11,borderWidth:1.5,borderColor:colors.ink,borderRadius:3},
 row:{minHeight:56,paddingHorizontal:16,paddingVertical:14,backgroundColor:colors.surface,flexDirection:'row',alignItems:'center',gap:14,borderBottomWidth:1,borderBottomColor:colors.line},packedRow:{backgroundColor:colors.selected},summaryRow:{minHeight:48,backgroundColor:'transparent',borderBottomColor:colors.line},summaryMark:{fontSize:11,fontWeight:'700',letterSpacing:0.8,textTransform:'uppercase',color:colors.muted,width:64},check:{width:28,height:28,borderWidth:1.5,borderColor:colors.muted,borderRadius:9,alignItems:'center',justifyContent:'center'},checked:{backgroundColor:colors.ink,borderColor:colors.ink},checkmark:{color:colors.surface,fontSize:19,fontWeight:'700'},item:{fontSize:17,lineHeight:24,color:colors.ink,flex:1}
});
