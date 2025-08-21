import React, { ReactNode } from "react";
import {
  TextInput,
  TextInputProps,
  TextProps,
  TextStyle,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";

export type ScreenWrapperProps = {
  style?: ViewStyle;
  children: React.ReactNode;
};

export type TypoProps = {
  size?: number;
  color?: string;
  fontWeight?: TextStyle["fontWeight"];
  children: any | null;
  style?: TextStyle;
  textProps?: TextProps;
};

export type BackButtonProps = {
  style?: ViewStyle;
  iconSize?: number;
};

export interface InputProps extends TextInputProps {
  icon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  inputRef?: React.RefObject<TextInput>;
  //   label?: string;
  //   error?: string;
}

export interface CustomButtonProps extends TouchableOpacityProps {
  style?: ViewStyle;
  onPress?: () => void;
  loading?: boolean;
  children: React.ReactNode;
}

export type UserType = {
  fullName: string;
  email: string;
  address: string;
  user_id: string;
  role: string;
  makeTransaction: boolean;
};

export type UserDataSignUpType = {
  user_id: string;
  fullName: string;
  address: string;
  email: string;
};

export type ModalWrapperProps = {
  style?: ViewStyle;
  children: React.ReactNode;
  bg?: string;
};

export type HeaderProps = {
  title?: string;
  style?: ViewStyle;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export type TransactionType = {
  id: string;
  userData: {
    address: string;
    email: string;
    fullName: string;
    role: string;
    user_id: string;
  };
  user_id: string;
  totalPay: number;
  createdAt: string;
  updatedAt: string;
  paymentMethod: string;
  status: string;
};

export type TransactionsWithSummaryType = {
  summary: number;
  transactions: TransactionType[];
};
