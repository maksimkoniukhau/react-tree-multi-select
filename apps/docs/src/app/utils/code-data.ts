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

export const customComponentBuiltin = `const CustomChipContainer: FC<ChipContainerProps> = (props) => (
  <>
    <Tooltip id="chip-tooltip" render={({content}) => (<span>{content}</span>)}/>
    <components.ChipContainer
      {...props}
      attributes={{
        ...props.attributes,
        "data-tooltip-id": "chip-tooltip",
        "data-tooltip-content": \`Tooltip for the \${props.ownProps.label}\`,
        "data-tooltip-place": "top"
      }}/>
  </>
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
