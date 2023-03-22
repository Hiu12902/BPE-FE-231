export const baseXml = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsd="http://www.w3.org/2001/XMLSchema" id="_2022090704555" targetNamespace="http://www.bizagi.com/definitions/_2022090704555">
  <process id="Id_a77e9019-520a-40b3-84aa-9140b31260d7" name="Process 1">
    <documentation />
    <laneSet id="Id_e7232ea6-9e62-4f54-9d50-c0ed15be1ec8" />
    <startEvent id="Id_51bab053-f5ca-454f-8497-56377e96130f" name="start_event">
      <documentation />
      <extensionElements>
        <bizagi:BizagiExtensions xmlns:bizagi="http://www.bizagi.com/bpmn20">
          <bizagi:BizagiProperties>
            <bizagi:BizagiProperty name="bgColor" value="#E6FF97" />
            <bizagi:BizagiProperty name="borderColor" value="#62A716" />
            <bizagi:BizagiProperty name="textColor" value="#000000" />
            <bizagi:BizagiProperty name="textBackgroundColor" value="#FFFFFF" />
            <bizagi:BizagiProperty name="textDirection" value="" />
            <bizagi:BizagiProperty name="runtimeProperties" value="{}" />
          </bizagi:BizagiProperties>
        </bizagi:BizagiExtensions>
      </extensionElements>
      <outgoing>Id_02ef5a59-a79f-4a79-93da-3998421af9c7</outgoing>
    </startEvent>
    <endEvent id="Id_b470c8ed-f7fd-4a23-8947-c70854d3f68b" name="end_event">
      <extensionElements>
        <bizagi:BizagiExtensions xmlns:bizagi="http://www.bizagi.com/bpmn20">
          <bizagi:BizagiProperties>
            <bizagi:BizagiProperty name="bgColor" value="#EEAAAA" />
            <bizagi:BizagiProperty name="borderColor" value="#990000" />
            <bizagi:BizagiProperty name="textColor" value="Black" />
            <bizagi:BizagiProperty name="textBackgroundColor" value="White" />
            <bizagi:BizagiProperty name="textDirection" value="" />
          </bizagi:BizagiProperties>
        </bizagi:BizagiExtensions>
      </extensionElements>
      <incoming>Flow_11hlaex</incoming>
    </endEvent>
    <sequenceFlow id="Id_02ef5a59-a79f-4a79-93da-3998421af9c7" sourceRef="Id_51bab053-f5ca-454f-8497-56377e96130f" targetRef="Activity_1ki2qhv">
      <extensionElements>
        <bizagi:BizagiExtensions xmlns:bizagi="http://www.bizagi.com/bpmn20">
          <bizagi:BizagiProperties>
            <bizagi:BizagiProperty name="bgColor" value="White" />
            <bizagi:BizagiProperty name="borderColor" value="Black" />
            <bizagi:BizagiProperty name="textColor" value="Black" />
            <bizagi:BizagiProperty name="textBackgroundColor" value="White" />
            <bizagi:BizagiProperty name="textDirection" value="" />
          </bizagi:BizagiProperties>
        </bizagi:BizagiExtensions>
      </extensionElements>
    </sequenceFlow>
    <task id="Activity_1ki2qhv" name="Task 1">
      <incoming>Id_02ef5a59-a79f-4a79-93da-3998421af9c7</incoming>
      <outgoing>Flow_11hlaex</outgoing>
    </task>
    <sequenceFlow id="Flow_11hlaex" sourceRef="Activity_1ki2qhv" targetRef="Id_b470c8ed-f7fd-4a23-8947-c70854d3f68b" />
  </process>
  <collaboration id="Id_d703c872-ccc2-4a1f-ac2e-3dcf9ef66353" name="Diagram 1">
    <documentation />
    <participant id="Id_4ecc15a6-2486-40d1-8e36-f0da959cc1ad" name="Process 1" processRef="Id_a77e9019-520a-40b3-84aa-9140b31260d7">
      <documentation />
      <extensionElements>
        <bizagi:BizagiExtensions xmlns:bizagi="http://www.bizagi.com/bpmn20">
          <bizagi:BizagiProperties>
            <bizagi:BizagiProperty name="bgColor" value="#FFFFFF" />
            <bizagi:BizagiProperty name="borderColor" value="#000000" />
            <bizagi:BizagiProperty name="textColor" value="#000000" />
            <bizagi:BizagiProperty name="textBackgroundColor" value="#FFFFFF" />
            <bizagi:BizagiProperty name="textDirection" value="" />
          </bizagi:BizagiProperties>
        </bizagi:BizagiExtensions>
      </extensionElements>
    </participant>
  </collaboration>
  <BPMNDiagram xmlns="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Diagram_17af96b7-8ed1-4ed7-b170-27382223f4a5">
    <BPMNPlane id="DiagramElement_95a93ac2-5d16-4ade-87c1-16ee43822b30" bpmnElement="Id_d703c872-ccc2-4a1f-ac2e-3dcf9ef66353">
      <extension xmlns="http://www.omg.org/spec/DD/20100524/DI" />
      <BPMNShape id="DiagramElement_1e52db0e-a041-42ee-9a90-880ad05b1a98" bpmnElement="Id_4ecc15a6-2486-40d1-8e36-f0da959cc1ad" isHorizontal="true">
        <extension xmlns="http://www.omg.org/spec/DD/20100524/DI" />
        <Bounds xmlns="http://www.omg.org/spec/DD/20100524/DC" x="30" y="30" width="700" height="350" />
        <BPMNLabel id="DiagramElement_58c09e18-d342-42b1-b5c8-e086f8817da1" labelStyle="Style_2efcd608-d89d-4ba9-8177-5a65e14950cd">
          <extension xmlns="http://www.omg.org/spec/DD/20100524/DI" />
          <Bounds xmlns="http://www.omg.org/spec/DD/20100524/DC" x="0" y="0" width="0" height="0" />
        </BPMNLabel>
      </BPMNShape>
      <BPMNShape id="DiagramElement_d89d1bfe-5a6c-4534-92a9-485b694b5419" bpmnElement="Id_51bab053-f5ca-454f-8497-56377e96130f">
        <extension xmlns="http://www.omg.org/spec/DD/20100524/DI" />
        <Bounds xmlns="http://www.omg.org/spec/DD/20100524/DC" x="194" y="185" width="30" height="30" />
        <BPMNLabel>
          <dc:Bounds x="181" y="222" width="56" height="14" />
        </BPMNLabel>
      </BPMNShape>
      <BPMNShape id="DiagramElement_c6c6bd03-861b-4115-933f-5f4fc9335be0" bpmnElement="Id_b470c8ed-f7fd-4a23-8947-c70854d3f68b">
        <extension xmlns="http://www.omg.org/spec/DD/20100524/DI" />
        <Bounds xmlns="http://www.omg.org/spec/DD/20100524/DC" x="545" y="185" width="30" height="30" />
        <BPMNLabel>
          <dc:Bounds x="534" y="222" width="52" height="14" />
        </BPMNLabel>
      </BPMNShape>
      <BPMNShape id="Activity_1ki2qhv_di" bpmnElement="Activity_1ki2qhv">
        <dc:Bounds x="350" y="160" width="100" height="80" />
        <BPMNLabel />
      </BPMNShape>
      <BPMNEdge id="DiagramElement_ac925975-edca-4a85-9eee-c053b86d72d5" bpmnElement="Id_02ef5a59-a79f-4a79-93da-3998421af9c7">
        <extension xmlns="http://www.omg.org/spec/DD/20100524/DI" />
        <di:waypoint x="224" y="200" />
        <di:waypoint x="350" y="200" />
      </BPMNEdge>
      <BPMNEdge id="Flow_11hlaex_di" bpmnElement="Flow_11hlaex">
        <di:waypoint x="450" y="200" />
        <di:waypoint x="545" y="200" />
      </BPMNEdge>
    </BPMNPlane>
    <BPMNLabelStyle id="Style_b94f34c8-c6c1-4cc2-a36c-9c7abd0ed921">
      <Font xmlns="http://www.omg.org/spec/DD/20100524/DC" name="Segoe UI" size="10" isBold="true" isItalic="false" isUnderline="false" isStrikeThrough="false" />
    </BPMNLabelStyle>
    <BPMNLabelStyle id="Style_2efcd608-d89d-4ba9-8177-5a65e14950cd">
      <Font xmlns="http://www.omg.org/spec/DD/20100524/DC" name="Segoe UI" size="10" isBold="true" isItalic="false" isUnderline="false" isStrikeThrough="false" />
    </BPMNLabelStyle>
    <BPMNLabelStyle id="Style_f5a81e61-3702-4c54-9977-fe45bac20302">
      <Font xmlns="http://www.omg.org/spec/DD/20100524/DC" name="Segoe UI" size="8" isBold="false" isItalic="false" isUnderline="false" isStrikeThrough="false" />
    </BPMNLabelStyle>
  </BPMNDiagram>
</definitions>
`;
