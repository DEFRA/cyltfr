function addFeature(featureIndex, type) {
  let featureHTML

  if (type === 'llfa') {
    // Generate HTML for the feature on LLFA reports
    featureHTML = `
      <div id="item_${featureIndex}" class="array-item">
        <div class="form-group field field-object">
          <fieldset id="features_${featureIndex}">
            <div class="form-group field field-object">
              <fieldset id="features_${featureIndex}_properties">
                <legend id="features_${featureIndex}_properties__title">properties</legend>
                <div class="hidden"><input type="hidden" id="features_${featureIndex}_properties_apply" value="llfa"></div>
                <div class="hidden"><input type="hidden" id="features_${featureIndex}_properties_riskOverride" value=""></div>
                <div class="form-group field field-string  govuk-form-group info"><label class="control-label"
                    for="features_${featureIndex}_properties_info">Report</label>
                  <p id="features_${featureIndex}_properties_info__description" class="field-description">The report text will display
                    to public users in this geometry.</p>
                  <div class="field-radio-group" id="features_${featureIndex}_properties_info">
                    <div class="radio "><label><span><input type="radio" name="features_${featureIndex}_properties_report_type" value="Flood report"><span>Flood report</span></span></label></div>
                    <div class="radio "><label><span><input type="radio" name="features_${featureIndex}_properties_report_type" value="Non compliant mapping"><span>Non compliant mapping</span></span></label></div>
                    <div class="radio "><label><span><input type="radio" name="features_${featureIndex}_properties_report_type" value="Proposed schemes"><span>Proposed schemes</span></span></label></div>
                    <div class="radio "><label><span><input type="radio" name="features_${featureIndex}_properties_report_type" value="Completed schemes"><span>Completed schemes</span></span></label></div>
                    <div class="radio "><label><span><input type="radio" name="features_${featureIndex}_properties_report_type" value="Flood action plan"><span>Flood action plan</span></span></label></div>
                    <div class="radio "><label><span><input type="radio" name="features_${featureIndex}_properties_report_type" value="Other info"><span>Other info</span></span></label></div>
                  </div>
                </div>
                <div class="form-group field field-string  govuk-form-group start"><label class="control-label"
                    for="features_${featureIndex}_properties_start">Valid from<span class="required">*</span></label>
                  <p id="features_${featureIndex}_properties_start__description" class="field-description">For your reference and will
                    not be displayed to public users. Your comments will not be uploaded automatically on this date. Your
                    comments will go live once they’re approved. If a date picker is not available, use YYYY-MM-DD.</p>
                    <input name="features_${featureIndex}_properties_start" type="date" id="features_${featureIndex}_properties_start" class="govuk-input govuk-input--width-20 start-date"
                    autocomplete="off" required="" value="">
                </div>
                <div class="form-group field field-string  govuk-form-group end"><label class="control-label"
                    for="features_${featureIndex}_properties_end">Valid to<span class="required">*</span></label>
                  <p id="features_${featureIndex}_properties_end__description" class="field-description">For your reference and will
                    not be displayed to public users. Your comments will not be removed automatically. It is your
                    responsibility to remove them on the ‘valid to’ date. If a date picker is not available, use YYYY-MM-DD.
                  </p>
                  <input name="features_${featureIndex}_properties_end" type="date" id="features_${featureIndex}_properties_end" class="govuk-input govuk-input--width-20 end-date"
                    autocomplete="off" required="" value="">
                </div>
              </fieldset>
            </div>
          </fieldset>
        </div>
        <div id="map_${featureIndex}" class="comment-map"></div>
      </div>
    `

  } else {
    // Generate HTML for the feature on holding comments
    featureHTML = `
      <div id="item_${featureIndex}" class="array-item">
        <div class="form-group field field-object">
          <fieldset id="features_${featureIndex}">
            <div class="form-group field field-object">
              <fieldset id="features_${featureIndex}_properties">
                <legend id="features_${featureIndex}_properties__title">properties</legend>
                <div class="hidden">
                  <input type="hidden" id="features_${featureIndex}_properties_apply" value="holding">
                </div>
                <div class="form-group field field-string  govuk-form-group riskOverride">
                  <label class="control-label" for="features_${featureIndex}_properties_riskOverride">
                    Override surface water risk
                  </label>
                  <p id="features_${featureIndex}_properties_riskOverride__description" class="field-description">
                    Choose if the risk for surface water flooding should be overriden for points inside this area
                  </p>
                  <ul class="field-radio-group" id="features_${featureIndex}_properties_riskOverride">
                    <li class="radio "><label><span><input id="map_${featureIndex}-no-override" type="radio" name="override_${featureIndex}-risk" value="Do not override" checked ><span>Do not override</span></span></label></li>
                    <li class="radio "><label><span><input id="map_${featureIndex}-override" type="radio" name="override_${featureIndex}" value="Override"><span>Override</span></span></label></li>
                    <ul id="risk-options_${featureIndex}" style="display: none">
                      <li class="radio "><label><span><input type="radio" name="override_${featureIndex}-risk" value="Very low"><span>Very low</span></span></label></li>
                      <li class="radio "><label><span><input type="radio" name="override_${featureIndex}-risk" value="Low"><span>Low</span></span></label></li>
                      <li class="radio "><label><span><input type="radio" name="override_${featureIndex}-risk" value="Medium"><span>Medium</span></span></label></li>
                      <li class="radio "><label><span><input type="radio" name="override_${featureIndex}-risk" value="High"><span>High</span></span></label></li>
                    </ul>
                  </ul>
                </div>
                <div class="form-group field field-string  govuk-form-group info">
                  <label class="control-label" for="features_${featureIndex}_properties_info">Info</label>
                  <div id="features_${featureIndex}_properties_info__description" class="field-description">
                    <p>The info text will display to public users in this geometry. Read <a href="/comment-guidance" target="_blank" previewlistener="true">comment guidance</a> before writing or pasting anything. The maximum number of characters is 150.</p>
                  </div>
                  <div>
                    <textarea name="features_${featureIndex}_properties_info" rows="5" id="features_${featureIndex}_properties_info" maxlength="150" class="govuk-textarea"></textarea>
                    <p class="govuk-hint govuk-character-count__message">You have <span class="remaining-chars-text"></span> characters remaining</p>
                  </div>
                </div>
                <div class="form-group field field-string  govuk-form-group start">
                  <label class="control-label" for="features_${featureIndex}_properties_start">Valid from<span class="required">*</span></label>
                  <p id="features_${featureIndex}_properties_start__description" class="field-description">For your reference and will not be displayed to public users. Your comments will not be uploaded automatically on this date. Your comments will go live once they’re approved. If a date picker is not available, use YYYY-MM-DD.</p>
                  <input name="features_${featureIndex}_properties_start" type="date" id="features_${featureIndex}_properties_start" class="start-date govuk-input govuk-input--width-20" autocomplete="off" required="">
                </div>
                <div class="form-group field field-string  govuk-form-group end">
                  <label class="control-label" for="features_${featureIndex}_properties_end">Valid to<span class="required">*</span></label>
                  <p id="features_${featureIndex}_properties_end__description" class="field-description">For your reference and will not be displayed to public users. Your comments will not be removed automatically. It is your responsibility to remove them on the ‘valid to’ date. If a date picker is not available, use YYYY-MM-DD.</p>
                  <input name="features_${featureIndex}_properties_end" type="date" id="features_${featureIndex}_properties_end" class="end-date govuk-input govuk-input--width-20" autocomplete="off" required="">
                </div>
              </fieldset>
            </div>
          </fieldset>
        </div>
        <div class="comment-map"></div>
      </div>
    `
  }

  // Append the HTML to the container element
  return featureHTML
}
