//Very much a WIP/TODO

import React from 'react';
import {compose} from 'recompose';


//HOCs
//import WithStateHandlersComponent from '../../highOrderComponents/WithStateHandlersComponent';


//consts
const DEFAULT_TRANSITION_TIME = 0.6;
export const DEFAULT = '_default_';
const supportsAnimation = !!document.body.animate;


export default class TransitionBetween extends React.Component {
  ref = null;

  state = {
    activeSection: undefined,
    nextSection: undefined,
    innerAnimation: null,
    outerAnimation: null,
  }

  render() {
    const ({
      children,
      selectedChild,
      onChangeSection,
      transitionHeight,
      component: Component = 'div',
      ...rest
    } = this.props;

    if(true || !supportsAnimation) {
      let visibleChild = null;

      React.Children.forEach(children, (child) => {
        if(!child || !React.isValidElement(child)) {
          return;
        }

        if(child.key === activeSection) {
          visibleChild = child;
        }
      })

      if(visibleChild) {
        //TODO get ref to this child + add some classes?
      }

      return <Component {...rest} ref={this._getRef}>
        {visibleChild}
      </Component>
    }
  }


  /*
  _setInnerAnimation = (newAnimation) => {
    const innerAnimation = this.state.innerAnimation;

    if(innerAnimation && !innerAnimation.finished) {//if current animation
      innerAnimation.cancel();//stop current animation
    }

    this.setState({innerAnimation: newAnimation});
  }

  _setOuterAnimation = (newAnimation) => {
    const outerAnimation = this.state.outerAnimation;

    if(outerAnimation && !outerAnimation.finished) {//if current animation
      outerAnimation.cancel();//stop current animation
    }

    this.setState({outerAnimation: newAnimation});
  }

  _setNextSection: (nextSection) => {
    //c/onsole.log('[TB] setNextSection: ', activeSection, nextSection, innerRef);
    const {onSectionHidden, activeSection, setInnerAnimation} = this.state;

    if(supportsAnimation) {
      let animation = null;

      if(nextSection === activeSection) {
        //transition cancelled mid-way
        animation = innerRef.animate([
          {opacity: window.getComputedStyle(innerRef).getPropertyValue('opacity')},
          {opacity: 1}
        ], {
          duration: transitionTime * 500,
          easing: 'ease-in'
        });
      } else {
        //fade out animation
        animation = innerRef.animate([
          {opacity: window.getComputedStyle(innerRef).getPropertyValue('opacity')},
          {opacity: 0}
        ], {
          duration: transitionTime * 500,
          easing: 'ease-in'
        });

        animation.onfinish = () => {
          onSectionHidden(activeSection);
        }
      }

      //record animation
      setInnerAnimation(animation);
    } else {
      //allow slight pause for state to update
      window.requestAnimationFrame(() => {
        onSectionHidden(activeSection);
      });
    }

    //update state
    return {nextSection}
  },
  setActiveSection: ({innerRef, setInnerAnimation}, {transitionTime = DEFAULT_TRANSITION_TIME}) => (activeSection) => {
    //c/onsole.log('[TB] setActiveSection: ', activeSection);
    if(supportsAnimation) {
      //fade in animation
      const animation = innerRef.animate([
        {opacity: innerRef.style.opacity === '' ? 0 : innerRef.style.opacity},
        {opacity: 1}
      ], {
        duration: transitionTime * 500,
        easing: 'ease-out'
        //fill: 'backwards'
      });

      //record animation
      setInnerAnimation(animation);

    }
    return {activeSection}
  },
  //Called once transition-out completed
  onSectionHidden: ({nextSection, activeSection, setInnerAnimation, setOuterAnimation, ref, innerRef}, {sectionHidden, transitionHeight, transitionTime = DEFAULT_TRANSITION_TIME}) => (section) => {
    //If this is the correct section transition complete
    if(nextSection !== undefined && activeSection == section) {
      if(sectionHidden) {
        setTimeout(() => {//needs slight delay to make sure animation is finished & item is unmounted before triggering changes
          sectionHidden(section, nextSection, ref);
        }, 0)
      }

      if(supportsAnimation) {
        //fade in animation
        const animation = innerRef.animate([
          {opacity: innerRef.style.opacity === '' ? 0 : innerRef.style.opacity},
          {opacity: 1}
        ], {
          duration: transitionTime * 500,
          easing: 'ease-out'
          //fill: 'backwards'
        });

        //record animation
        setInnerAnimation(animation);

        if(transitionHeight) {
          //Now animation height
          //-record values just before items change
          const curHeight = innerRef.offsetHeight;
          ref.style.height = `${curHeight}px`;

          //pause, then start delay with new content height
          window.requestAnimationFrame(() => {
            ref.style.height = '';

            const animation = innerRef.animate([
              {height: `${curHeight}px`},
              {height: `${innerRef.offsetHeight}px`},
            ], {
              duration: transitionTime * 500,
              easing: 'ease-in-out',
            });

            setOuterAnimation(animation);
          })
        }
      }

      //update state
      return {activeSection: nextSection, nextSection: undefined};
    }
  },


  _getRef = (newRef) => {
    props.getRef && props.getRef(newRef);

    this.ref = newRef;
  }


  render() {
    const ({
      children,
      selectedChild,
      onChangeSection,
      transitionHeight,
      component: Component = 'div',
      ...rest
    } = this.props;

    let visibleChild = null;

    React.Children.forEach(children, (child) => {
      if(!child || !React.isValidElement(child)) {
        return;
      }

      if(child.key === activeSection) {
        visibleChild = child;
      }
    })

    if(visibleChild) {
      //TODO get ref to this child + add some classes?
    }

    return <Component {...rest} ref={this._getRef}>
      {visibleChild}
    </Component>
  }
}*/


//The component
/*compose(
  WithStateHandlersComponent(
    {
      activeSection: undefined,
      nextSection: undefined,
      ref: null,
      innerRef: null,
      innerAnimation: null,
      outerAnimation: null
    },
    {
      setInnerAnimation: ({innerAnimation}) => (newAnimation) => {
        if(innerAnimation && !innerAnimation.finished) {//if current animation
          innerAnimation.cancel();//stop current animation
        }

        return {innerAnimation: newAnimation};
      },
      setOuterAnimation: ({outerAnimation}) => (newAnimation) => {
        if(outerAnimation && !outerAnimation.finished) {//if current animation
          outerAnimation.cancel();//stop current animation
        }

        return {outerAnimation: newAnimation};
      },
      setNextSection: ({innerRef, onSectionHidden, activeSection, setInnerAnimation}, {transitionTime = DEFAULT_TRANSITION_TIME}) => (nextSection) => {
        //c/onsole.log('[TB] setNextSection: ', activeSection, nextSection, innerRef);

        if(supportsAnimation) {
          let animation = null;

          if(nextSection === activeSection) {
            //transition cancelled mid-way
            animation = innerRef.animate([
              {opacity: window.getComputedStyle(innerRef).getPropertyValue('opacity')},
              {opacity: 1}
            ], {
              duration: transitionTime * 500,
              easing: 'ease-in'
            });
          } else {
            //fade out animation
            animation = innerRef.animate([
              {opacity: window.getComputedStyle(innerRef).getPropertyValue('opacity')},
              {opacity: 0}
            ], {
              duration: transitionTime * 500,
              easing: 'ease-in'
            });

            animation.onfinish = () => {
              onSectionHidden(activeSection);
            }
          }

          //record animation
          setInnerAnimation(animation);
        } else {
          //allow slight pause for state to update
          window.requestAnimationFrame(() => {
            onSectionHidden(activeSection);
          });
        }

        //update state
        return {nextSection}
      },
      setActiveSection: ({innerRef, setInnerAnimation}, {transitionTime = DEFAULT_TRANSITION_TIME}) => (activeSection) => {
        //c/onsole.log('[TB] setActiveSection: ', activeSection);
        if(supportsAnimation) {
          //fade in animation
          const animation = innerRef.animate([
            {opacity: innerRef.style.opacity === '' ? 0 : innerRef.style.opacity},
            {opacity: 1}
          ], {
            duration: transitionTime * 500,
            easing: 'ease-out'
            //fill: 'backwards'
          });

          //record animation
          setInnerAnimation(animation);

        }
        return {activeSection}
      },
      //Called once transition-out completed
      onSectionHidden: ({nextSection, activeSection, setInnerAnimation, setOuterAnimation, ref, innerRef}, {sectionHidden, transitionHeight, transitionTime = DEFAULT_TRANSITION_TIME}) => (section) => {
        //If this is the correct section transition complete
        if(nextSection !== undefined && activeSection == section) {
          if(sectionHidden) {
            setTimeout(() => {//needs slight delay to make sure animation is finished & item is unmounted before triggering changes
              sectionHidden(section, nextSection, ref);
            }, 0)
          }

          if(supportsAnimation) {
            //fade in animation
            const animation = innerRef.animate([
              {opacity: innerRef.style.opacity === '' ? 0 : innerRef.style.opacity},
              {opacity: 1}
            ], {
              duration: transitionTime * 500,
              easing: 'ease-out'
              //fill: 'backwards'
            });

            //record animation
            setInnerAnimation(animation);

            if(transitionHeight) {
              //Now animation height
              //-record values just before items change
              const curHeight = innerRef.offsetHeight;
              ref.style.height = `${curHeight}px`;

              //pause, then start delay with new content height
              window.requestAnimationFrame(() => {
                ref.style.height = '';

                const animation = innerRef.animate([
                  {height: `${curHeight}px`},
                  {height: `${innerRef.offsetHeight}px`},
                ], {
                  duration: transitionTime * 500,
                  easing: 'ease-in-out',
                });

                setOuterAnimation(animation);
              })
            }
          }

          //update state
          return {activeSection: nextSection, nextSection: undefined};
        }
      },
      getRef: ({ref}, {getRef}) => (newRef) => {
        getRef && getRef(newRef);

        if(newRef === ref) {
          return;
        }

        return {ref: newRef}
      },
      setInnerRef: () => (innerRef) => {
        return {innerRef}
      }
    },
    {
      withPropsOnChange: [
        ['selectedSection', 'innerRef'],
        ({innerRef, children, selectedSection, nextSection, setNextSection, activeSection, setActiveSection}) => {
          if(!innerRef) {
            return;//wait until innerRef exists
          }

          //Cannot use React.Children.toArray becuase it changes the value of 'key'
          const allChildren = [];
          React.Children.forEach(children, (child) => {
            allChildren.push(child);
          });

          //if nextSection not found, and there is a default, then use that
          if(selectedSection && !allChildren.some((child) => {
              return child && child.key == selectedSection;
            }) && allChildren.some((child) => {
              return child && child.key == DEFAULT
            })) {
            selectedSection = DEFAULT;
          }

          if(nextSection) {//if mid transition
            if(nextSection !== selectedSection) {
              setNextSection(selectedSection)
            }
          } else {//not mid transition
            if(selectedSection != activeSection) {
              if(!activeSection) {//nothing currently set
                setActiveSection(selectedSection);
              } else {
                setNextSection(selectedSection)
              }
            }
          }
        }
      ],
      mapProps: ({
          setNextSection,
          setActiveSection,
          selectedSection,
          ref,
          innerRef,
          innerAnimation,
          outerAnimation,
          setInnerAnimation,
          setOuterAnimation,
          ...rest
        }) => {
          return {
            ...rest,
          };
        }
    }
  )
)(
  function TransitionBetween({children, activeSection, nextSection, onSectionHidden, getRef, setInnerRef, transitionHeight, component: Component = 'div',componentClassName, innerClass, sectionHidden, ...rest}) {
    return <Component className={'transitionBetween'+(transitionHeight? ' transitionBetween_transitionHeight' : '')+(componentClassName ? ' '+componentClassName : '')} {...rest} ref={getRef}>
      <Component className={'transitionBetween-inner'+(transitionHeight? ' transitionBetween-inner_transitionHeight' : '')+(innerClass ? ` ${innerClass}` : '')} ref={setInnerRef}>
        {React.Children.map(children, (child) => {
          if(!child || !React.isValidElement(child)) {
            return null;
          }

          const section = child.key;
          const isSectionVisible = activeSection === section;

          return isSectionVisible && child
        })}
      </Component>
    </Component>
  }
)*/
