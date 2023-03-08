// Import your custom property entries.
// The entry is a text input field with logic attached to create,
// update and delete the "spell" property.
import { is } from 'bpmn-js/lib/util/ModelUtil';
import PropertiesGroups from './groups';
const LOW_PRIORITY = 500;


/**
 * A provider with a `#getGroups(element)` method
 * that exposes groups for a diagram element.
 *
 * @param {PropertiesPanel} propertiesPanel
 * @param {Function} translate
 */
export default function PropertiesProvider(propertiesPanel, translate) {
  // API ////////

  /**
   * Return the groups provided for the given element.
   *
   * @param {DiagramElement} element
   *
   * @return {(Object[]) => (Object[])} groups middleware
   */
  this.getGroups = function (element) {
    /**
     * We return a middleware that modifies
     * the existing groups.
     *
     * @param {Object[]} groups
     *
     * @return {Object[]} modified groups
     */
    return function (groups) {

      // Add the "magic" group
      if (is(element, 'bpmn:Task')) {
        groups.push(PropertiesGroups.createTaskGroup(element, translate));
      }

      if (is(element, 'bpmn:ExclusiveGateway')) {
        groups.push(PropertiesGroups.createExclusiveGatewayGroup(element, translate));
      }

      if (is(element, 'bpmn:LinkEvent')) {
        groups.push(PropertiesGroups.createLinkEventGroup(element, translate));
      }
      return groups;
    }
  };


  // registration ////////

  // Register our custom magic properties provider.
  // Use a lower priority to ensure it is loaded after
  // the basic BPMN properties.
  propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

PropertiesProvider.$inject = ['propertiesPanel', 'translate'];