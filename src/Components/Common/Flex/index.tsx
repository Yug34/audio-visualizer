import styled from "styled-components";

export interface FlexProps {
    flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-evenly' | 'space-around';
    align?: 'flex-start' | 'flex-end' | 'baseline' | 'center' | 'space-between' | 'space-evenly';
    flexWrap?: 'wrap' | 'wrap-reverse' | 'no-wrap';
    mt?: string | number;
    mb?: string | number;
    ml?: string | number;
    mr?: string | number;
    m?: string | number;
    pt?: string | number;
    pb?: string | number;
    pl?: string | number;
    pr?: string | number;
    p?: string | number;
    color?: string | number;
    width?: string | number;
    height?: string | number;
    colGap?: string;
    rowGap?: string;
}

export const Flex = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${(props) => props.flexDirection || 'row'};
  justify-content: ${(props) => props.justify || ''};
  align-items: ${(props) => props.align || ''};
  margin: ${(props) => props.m || 0};
  padding: ${(props) => props.p || 0};
  margin-top: ${(props) => props.mt || '0'};
  margin-bottom: ${(props) => props.mb || '0'};
  margin-left: ${(props) => props.ml || '0'};
  margin-right: ${(props) => props.mr || '0'};
  padding-top: ${(props) => props.pt || '0'};
  padding-bottom: ${(props) => props.pb || '0'};
  padding-left: ${(props) => props.pl || '0'};
  padding-right: ${(props) => props.pr || '0'};
  color: ${(props) => props.color || 'inherit'};
  width: ${(props) => props.width || '100%'};
  height: ${(props) => props.height || ''};
  flex-wrap: ${(props) => props.flexWrap || ''};
  column-gap: ${(props) => props.colGap || '0px'};
  row-gap: ${(props) => props.rowGap || '0px'};
`;