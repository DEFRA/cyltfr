<?xml version="1.0" encoding="ISO-8859-1"?>
<StyledLayerDescriptor version="1.0.0" 
 xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" 
 xmlns="http://www.opengis.net/sld" 
 xmlns:ogc="http://www.opengis.net/ogc" 
 xmlns:xlink="http://www.w3.org/1999/xlink" 
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <!-- a Named Layer is the basic building block of an SLD document -->
  <NamedLayer>
    <Name>SWV</Name>
    <UserStyle>
    <!-- Styles can have names, titles and abstracts -->
      <Title>Surface water Velocty</Title>
      <Abstract></Abstract>
      <!-- FeatureTypeStyles describe how to render different features -->
      <!-- A FeatureTypeStyle for rendering polygons -->
      
      
      <FeatureTypeStyle>
        <Rule>
          <Name>less than 0.25m</Name>
          <Title>less than 0.25m</Title>
          
        <ogc:Filter>
            
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>velocity</ogc:PropertyName>
              <ogc:Literal>0.00 - 0.25</ogc:Literal>
             </ogc:PropertyIsEqualTo>
            
        </ogc:Filter>
          
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#A2CFFF</CssParameter>
            </Fill>
          </PolygonSymbolizer>
        </Rule>
      </FeatureTypeStyle>
      
      <FeatureTypeStyle>
        <Rule>
          <Name>over 0.25m</Name>
          <Title>over 0.25m</Title>

          <!-- like a polygonsymbolizer -->
        <ogc:Filter>
          <ogc:Not>
             <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>velocity</ogc:PropertyName>
              <ogc:Literal>0.00 - 0.25</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Not>
          
        </ogc:Filter>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#3D4489</CssParameter>
            </Fill>
          </PolygonSymbolizer>
        </Rule>
      </FeatureTypeStyle>
        
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>