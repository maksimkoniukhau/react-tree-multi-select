export const customComponentCommonPattern = `const CustomChipLabel: FC<ChipLabelProps> = (props) => (
  <div {...props.attributes}>
     {/*your custom code here*/}
  </div>
);`;

export const customComponentMergeClassname = `const CustomChipLabel: FC<ChipLabelProps> = (props) => (
  <div {...props.attributes} className={\`\${props.attributes.className} custom-classname\`}>
     {/*your custom code here*/}
  </div>
);`;

export const customProps = `const components: Components = useMemo(() => (
    {
      ChipLabel: {
        component: CustomChipLabel,
        props: {suffix: 'Yo'}
      }
    }
  ), []);`;

export const tsSupport = `const createComponents = (label: string): Components<{ Field: FieldType<CustomFieldProps>; }> => ({
    Field: {
      component: CustomField,
      props: {label},
    },
  });`;

export const virtualFocusIdDefinition = `field:<elementId> 
dropdown:<elementId>`;
