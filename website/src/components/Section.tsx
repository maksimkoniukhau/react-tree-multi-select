import React, {FC, memo, ReactNode} from 'react';

export interface SectionProps {
  id: string;
  children: ReactNode;
}

export const Section: FC<SectionProps> = memo((props) => {

  return (
    <div id={props.id} className="section-heading">
      {props.children}
    </div>
  );
});
