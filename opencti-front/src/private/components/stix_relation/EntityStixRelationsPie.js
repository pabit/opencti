import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { compose } from 'ramda';
import graphql from 'babel-plugin-relay/macro';
import PieChart from 'recharts/lib/chart/PieChart';
import Pie from 'recharts/lib/polar/Pie';
import Cell from 'recharts/lib/component/Cell';
import Legend from 'recharts/lib/component/Legend';
import ResponsiveContainer from 'recharts/lib/component/ResponsiveContainer';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { QueryRenderer } from '../../../relay/environment';
import inject18n from '../../../components/i18n';
import { itemColor } from '../../../utils/Colors';

const styles = theme => ({
  paper: {
    minHeight: '100%',
    margin: '10px 0 0 0',
    padding: 0,
    backgroundColor: theme.palette.paper.background,
    color: theme.palette.text.main,
    borderRadius: 6,
  },
});
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent, index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const entityStixRelationsRadarStixRelationDistributionQuery = graphql`
    query EntityStixRelationsRadarStixRelationDistributionQuery($fromId: String, $toTypes: [String], $relationType: String, $field: String!, $operation: StatsOperation!) {
        stixRelationsDistribution(fromId: $fromId, toTypes: $toTypes, relationType: $relationType, field: $field, operation: $operation) {
            label,
            value
        }
    }
`;

class EntityStixRelationsPie extends Component {
  render() {
    const {
      t, classes, entityId, entityType, relationType, field,
    } = this.props;
    const stixRelationsDistributionVariables = {
      fromId: entityId,
      toTypes: entityType ? [entityType] : null,
      relationType,
      field,
      operation: 'count',
    };
    return (
      <div style={{ height: '100%' }}>
        <Typography variant='h4' gutterBottom={true}>
          {t('Distribution:')} {t(`entity_${entityType}`)}
        </Typography>
        <Paper classes={{ root: classes.paper }} elevation={2}>
          <QueryRenderer
            query={entityStixRelationsRadarStixRelationDistributionQuery}
            variables={stixRelationsDistributionVariables}
            render={({ props }) => {
              if (props && props.stixRelationsDistribution) {
                return (
                  <ResponsiveContainer height={300} width='100%'>
                    <PieChart margin={{
                      top: 50, right: 12, bottom: 25, left: 0,
                    }}>
                      <Pie data={props.stixRelationsDistribution} dataKey='value' nameKey='label' cx='50%' cy='50%' outerRadius={100} fill='#82ca9d' label={renderCustomizedLabel} labelLine={false}>
                        {
                          props.stixRelationsDistribution.map((entry, index) => <Cell key={index} fill={itemColor(entry.label)}/>)
                        }
                      </Pie>
                      <Legend verticalAlign='bottom' wrapperStyle={{ paddingTop: 20 }}/>
                    </PieChart>
                  </ResponsiveContainer>
                );
              }
              return (
                <div> &nbsp; </div>
              );
            }}
          />
        </Paper>
      </div>
    );
  }
}

EntityStixRelationsPie.propTypes = {
  entityId: PropTypes.string,
  relationType: PropTypes.string,
  entityType: PropTypes.string,
  field: PropTypes.string,
  classes: PropTypes.object,
  t: PropTypes.func,
  fld: PropTypes.func,
};

export default compose(
  inject18n,
  withStyles(styles),
)(EntityStixRelationsPie);