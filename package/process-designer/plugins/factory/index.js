

import CommandModule from 'diagram-js/lib/command';
import TooltipsModule from 'diagram-js/lib/features/tooltips';
import LabelSupportModule from 'diagram-js/lib/features/label-support';
import AttachSupportModule from 'diagram-js/lib/features/attach-support';
import SelectionModule from 'diagram-js/lib/features/selection';
import ChangeSupportModule from 'diagram-js/lib/features/change-support';
import SpaceToolModule from 'diagram-js/lib/features/space-tool';

import BpmnFactory from './bpmnFactory';


export default {
  __init__: [
    'modeling',
    'bpmnUpdater'
  ],
  __depends__: [
    CommandModule,
    TooltipsModule,
    LabelSupportModule,
    AttachSupportModule,
    SelectionModule,
    ChangeSupportModule,
    SpaceToolModule
  ],
  bpmnFactory: [ 'type', BpmnFactory ],
};
