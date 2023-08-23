<?xml version="1.0" encoding="ISO-8859-1"?>
<StyledLayerDescriptor version="1.0.0" 
 xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" 
 xmlns="http://www.opengis.net/sld" 
 xmlns:ogc="http://www.opengis.net/ogc" 
 xmlns:xlink="http://www.w3.org/1999/xlink" 
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <!-- a Named Layer is the basic building block of an SLD document -->
  <NamedLayer>
    <Name>SWDir</Name>
    <UserStyle>
    <!-- Styles can have names, titles and abstracts -->
      <Title>Surface water Direction</Title>
      <Abstract></Abstract>
      <!-- FeatureTypeStyles describe how to render different features -->
      <!-- A FeatureTypeStyle for rendering polygons -->
      <FeatureTypeStyle>
        
        
        <Rule>
          <Name>North</Name>
          <Title>North</Title>
         
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>direction</ogc:PropertyName>
                <ogc:Literal>N</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          
          <MaxScaleDenominator>7000</MaxScaleDenominator>
          
          <PointSymbolizer>
                 <Graphic>
              <ExternalGraphic>
                <OnlineResource xlink:type="simple"
                                    xlink:href="arrow.png"/>
                <Format>image/png</Format>
              </ExternalGraphic>
              <Rotation>-90</Rotation>
            </Graphic>
          </PointSymbolizer>
        </Rule>
        
         <Rule>
          <Name>NorthEast</Name>
          <Title>NorthEast</Title>
         
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>direction</ogc:PropertyName>
                <ogc:Literal>NE</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          
          <MaxScaleDenominator>7000</MaxScaleDenominator>
          
          <PointSymbolizer>
                 <Graphic>
              <ExternalGraphic>
                <OnlineResource xlink:type="simple"
                                    xlink:href="arrow.png"/>
                <Format>image/png</Format>
              </ExternalGraphic>
              <Rotation>-45</Rotation>
            </Graphic>
          </PointSymbolizer>
        </Rule>
        
         <Rule>
          <Name>East</Name>
          <Title>East</Title>
         
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>direction</ogc:PropertyName>
                <ogc:Literal>E</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          
          <MaxScaleDenominator>7000</MaxScaleDenominator>
          
          <PointSymbolizer>
            <Graphic>
              <ExternalGraphic>
                <OnlineResource xlink:type="simple"
                                    xlink:href="arrow.png"/>
                <Format>image/png</Format>
              </ExternalGraphic>
            </Graphic>
          </PointSymbolizer>
        </Rule>
        
        <Rule>
          <Name>SouthEast</Name>
          <Title>SouthEast</Title>
         
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>direction</ogc:PropertyName>
                <ogc:Literal>SE</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          
          <MaxScaleDenominator>7000</MaxScaleDenominator>
          
          <PointSymbolizer>
            <Graphic>
              <ExternalGraphic>
                <OnlineResource xlink:type="simple"
                                    xlink:href="arrow.png"/>
                <Format>image/png</Format>
              </ExternalGraphic>
              <Rotation>45</Rotation>
            </Graphic>
          </PointSymbolizer>
        </Rule>
        
        <Rule>
          <Name>South</Name>
          <Title>South</Title>
         
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>direction</ogc:PropertyName>
                <ogc:Literal>S</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          
          <MaxScaleDenominator>7000</MaxScaleDenominator>
          
          <PointSymbolizer>
            <Graphic>
              <ExternalGraphic>
                <OnlineResource xlink:type="simple"
                                    xlink:href="arrow.png"/>
                <Format>image/png</Format>
              </ExternalGraphic>
              <Rotation>90</Rotation>
            </Graphic>
          </PointSymbolizer>
        </Rule>
        
             <Rule>
          <Name>SouthWest</Name>
          <Title>SouthWest</Title>
         
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>direction</ogc:PropertyName>
                <ogc:Literal>SW</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          
          <MaxScaleDenominator>7000</MaxScaleDenominator>
          
          <PointSymbolizer>
            <Graphic>
              <ExternalGraphic>
                <OnlineResource xlink:type="simple"
                                    xlink:href="arrow.png"/>
                <Format>image/png</Format>
              </ExternalGraphic>
              <Rotation>135</Rotation>
            </Graphic>
          </PointSymbolizer>
        </Rule>
        
             <Rule>
          <Name>West</Name>
          <Title>West</Title>
         
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>direction</ogc:PropertyName>
                <ogc:Literal>W</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          
          <MaxScaleDenominator>7000</MaxScaleDenominator>
          
          <PointSymbolizer>
            <Graphic>
              <ExternalGraphic>
                <OnlineResource xlink:type="simple"
                                    xlink:href="arrow.png"/>
                <Format>image/png</Format>
              </ExternalGraphic>
              <Rotation>180</Rotation>
            </Graphic>
          </PointSymbolizer>
        </Rule>
           
        <Rule>
          <Name>NorthWest</Name>
          <Title>NorthWest</Title>
         
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>direction</ogc:PropertyName>
                <ogc:Literal>NW</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          
          <MaxScaleDenominator>7000</MaxScaleDenominator>
          
          <PointSymbolizer>
            <Graphic>
              <ExternalGraphic>
                <OnlineResource xlink:type="simple"
                                    xlink:href="arrow.png"/>
                <Format>image/png</Format>
              </ExternalGraphic>
              <Rotation>-135</Rotation>
            </Graphic>
          </PointSymbolizer>
        </Rule>
      
        
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>